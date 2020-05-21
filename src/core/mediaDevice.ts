import { Emitter } from './emitter';

interface Config {
    audio: boolean;
    video: boolean;
}

/**
 * Manage all media devices
 */
export class MediaDevice extends Emitter {
    stream: MediaStream | undefined;
    /**
     * Start media devices and send stream
     */
    start(config?: Config) {
        const constraints = {
            video: {
                facingMode: 'user',
                height: { min: 360, ideal: 720, max: 1080 },
            },
            audio: true,
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream: MediaStream) => {
                this.stream = stream;
                this.emit('stream', stream);
            })
            .catch((err: Error) => {
                if (err instanceof DOMException) {
                    alert('Cannot open webcam and/or microphone');
                } else {
                    console.log(err);
                }
            });

        return this;
    }

    /**
     * Get media stream by type
     * @param type {String} type - Type of the device
     */
    getStream(type: string): MediaStreamTrack[] {
        if (this.stream && type === 'Audio') return this.stream.getAudioTracks();
        else if (this.stream && type === 'Video') return this.stream.getVideoTracks();
        else return [];
    }

    /**
     * Turn on/off a device
     * @param {String} type - Type of the device
     * @param {Boolean} [on] - State of the device
     */
    toggle(type: string, on?: boolean) {
        this.getStream(type).forEach((track: MediaStreamTrack) => {
            if (typeof on === 'boolean') track['enabled'] = on;
            else track['enabled'] = !track.enabled;
        });
        return this;
    }

    /**
     * Stop all media track of devices
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
        return this;
    }
}
