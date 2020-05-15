export { PeerConnection } from './peerConnection';
export { MediaDevice } from './mediaDevice';
export { Emitter } from './emitter';

export function isEmpty(value: any) {
    return (
        value == null || // Always use === - but obj == null is allowed to check null || undefined
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}
