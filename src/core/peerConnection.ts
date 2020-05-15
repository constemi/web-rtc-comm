import { MediaDevice } from './mediaDevice';
import { Emitter } from './emitter';

import socket from '../socket';

interface Config {
    audio: boolean;
    video: boolean;
}

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
     * @param {String} friendID - ID of the friend you want to call.
     */
    connection: any;
    mediaDevice: MediaDevice;
    friendID: string;

    constructor(friendID: string) {
        super();
        this.connection = new RTCPeerConnection(configuration);
        this.connection.onicecandidate = (event: any) =>
            socket.emit('call', {
                to: this.friendID,
                candidate: event.candidate,
            });
        this.connection.ontrack = (event: any) => this.emit('peerStream', event.streams[0]);
        this.mediaDevice = new MediaDevice();
        this.friendID = friendID;
    }

    /**
     * Starting the call
     * @param {Boolean} isCaller
     * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
     */
    start(isCaller: boolean, config: Config): PeerConnection {
        this.mediaDevice
            .on('stream', (stream: any) => {
                stream.getTracks().forEach((track: any) => {
                    this.connection.addTrack(track, stream);
                });
                this.emit('localStream', stream);
                if (isCaller) socket.emit('request', { to: this.friendID });
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
            socket.emit('end', { to: this.friendID });
        }
        this.mediaDevice.stop();
        this.connection.close();
        this.connection = null;
        this.off();
        return this;
    }

    createOffer(): PeerConnection {
        this.connection
            .createOffer()
            .then(this.getDescription.bind(this))
            .catch((err: Error) => console.log(err));
        return this;
    }

    createAnswer(): PeerConnection {
        this.connection
            .createAnswer()
            .then(this.getDescription.bind(this))
            .catch((err: Error) => console.log(err));
        return this;
    }

    getDescription(desc: string): PeerConnection {
        this.connection.setLocalDescription(desc);
        socket.emit('call', { to: this.friendID, sdp: desc });
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
