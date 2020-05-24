import React, { useState, useEffect, useRef } from 'react';
import { Button, Box } from 'grommet';
import { Video as Camera, Volume, FormClose } from 'grommet-icons';
import { MediaDevice } from '../core';
import { Config } from '../core/types';

interface Props {
    config: Config;
    peerSrc: MediaStream | null;
    localSrc: MediaStream | null;
    mediaDevice: MediaDevice;
    closeStream: (isStarter: boolean) => void;
}

export function StreamDisplay({ peerSrc, localSrc, config, mediaDevice, closeStream }: Props): React.ReactElement {
    const peerVideo = useRef<HTMLVideoElement | null>(null);
    const localVideo = useRef<HTMLVideoElement | null>(null);
    const [video, setVideo] = useState<boolean>(config.video);
    const [audio, setAudio] = useState<boolean>(config.audio);

    useEffect(() => {
        if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
        if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
    });

    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Video', video);
            mediaDevice.toggle('Audio', audio);
        }
    });

    /**
     * Turn on/off a media device
     * @param {String} deviceType - Type of the device eg: Video, Audio
     */
    const toggleMediaDevice = (deviceType: string) => {
        if (deviceType === 'video') {
            setVideo(!video);
            mediaDevice.toggle('Video');
        }
        if (deviceType === 'audio') {
            setAudio(!audio);
            mediaDevice.toggle('Audio');
        }
    };

    return (
        <Box direction="column" justify="around">
            <Box responsive wrap direction="row" border={{ color: 'brand', size: 'large' }}>
                <video id="peerVideo" ref={peerVideo} width="50%" autoPlay />
                <video id="localVideo" ref={localVideo} width="50%" autoPlay muted />
            </Box>
            <Box className="video-control" direction="row" justify="end">
                <Button icon={<Camera />} active={video} onClick={() => toggleMediaDevice('video')} />
                <Button icon={<Volume />} active={audio} onClick={() => toggleMediaDevice('audio')} />
                <Button icon={<FormClose />} onClick={() => closeStream(true)} />
            </Box>
        </Box>
    );
}
