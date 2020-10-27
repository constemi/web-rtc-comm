import { PeerConnection } from './peerConnection';

export interface Message {
    sent: Date;
    to: string;
    from: string;
    content: string;
}

export interface Config {
    audio: boolean;
    video: boolean;
}

export type Connection = PeerConnection | Record<string, any>;
