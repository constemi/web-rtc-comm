import { MediaDevice } from './mediaDevice';
import { Emitter } from './emitter';
import { Config } from './types';

import socket from '../socket';

const configuration = {
    iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
        {
            urls: 'turn:numb.viagenie.ca',
            username: 'digitalwave@protonmail.ch',
            credential: 'v6zXURZ^0QnN',
        },
    ],
};

export class PeerConnection extends Emitter {
    /**
     * Create a PeerConnection.
     * @param {String} friendId - ID of the friend you want to call.
     */
    connection: RTCPeerConnection;
    mediaDevice: MediaDevice;
    friendId: string;

    constructor(friendId: string) {
        super();
        this.connection = new RTCPeerConnection(configuration);
        this.connection.ontrack = (event: RTCTrackEvent) => this.emit('peerStream', event.streams[0]);
        this.connection.onicecandidate = (event: RTCPeerConnectionIceEvent) =>
            socket.emit('call', {
                to: this.friendId,
                candidate: event.candidate,
            });

        this.mediaDevice = new MediaDevice();
        this.friendId = friendId;
    }

    /**
     * Starting the call
     * @param {Boolean} isCaller
     * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
     */
    start(isCaller: boolean, config: Config): PeerConnection {
        this.mediaDevice
            .on('stream', (stream: MediaStream) => {
                stream.getTracks().forEach((track: MediaStreamTrack) => {
                    this.connection.addTrack(track, stream);
                });
                this.emit('localStream', stream);
                if (isCaller) socket.emit('request', { to: this.friendId });
                else this.createOffer();
            })
            .start(config);

        return this;
    }

    /**
     * Stop the call
     * @param {Boolean} isStarter
     */
    stop(isStarter: boolean): PeerConnection {
        if (isStarter) {
            socket.emit('end', { to: this.friendId });
        }
        this.mediaDevice.stop();
        this.connection.close();
        this.connection = {} as RTCPeerConnection;
        this.off();
        return this;
    }

    createOffer(): PeerConnection | PromiseLike<PeerConnection> {
        this.connection
            .createOffer()
            .then(this.getDescription.bind(this))
            .catch((err: Error) => console.log(err));
        return this;
    }

    createAnswer(): PeerConnection | PromiseLike<PeerConnection> {
        this.connection
            .createAnswer()
            .then(this.getDescription.bind(this))
            .catch((err: Error) => console.log(err));
        return this;
    }

    getDescription(desc: RTCSessionDescriptionInit): PeerConnection {
        this.connection.setLocalDescription(desc);
        socket.emit('call', { to: this.friendId, sdp: desc });
        return this;
    }

    /**
     * @param {Object} sdp - Session description
     */
    setRemoteDescription(sdp: RTCSessionDescriptionInit): PeerConnection {
        const rtcSdp = new RTCSessionDescription(sdp);
        this.connection.setRemoteDescription(rtcSdp);
        return this;
    }

    /**
     * @param {Object} candidate - ICE Candidate
     */
    addIceCandidate(candidate: RTCIceCandidateInit): PeerConnection {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.connection.addIceCandidate(iceCandidate);
        }
        return this;
    }
}
