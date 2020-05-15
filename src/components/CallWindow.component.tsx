import React, { useState, useEffect, useRef } from 'react';
import { Button, Box } from 'grommet';
import { Video as Camera, Volume, FormClose } from 'grommet-icons';

interface Config {
    audio: boolean;
    video: boolean;
}

interface Props {
    config: Config;
    peerSrc: object;
    localSrc: object;
    status: string;
    mediaDevice: any;
    endCall: (isStarter: boolean) => void;
}

export function CallWindow({ peerSrc, localSrc, config, mediaDevice, status, endCall }: Props): React.ReactElement {
    const peerVideo: any = useRef(null);
    const localVideo: any = useRef(null);
    const [video, setVideo] = useState(config.video);
    const [audio, setAudio] = useState(config.audio);

    useEffect(() => {
        console.log(status);
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
                {/*  <video autoPlay muted>
                    <source key="video" src="https://v2.grommet.io/assets/small.mp4" type="video/mp4" />
                </video>

                <video className="localVideo" autoPlay muted>
                    <source key="video" src="https://v2.grommet.io/assets/small.mp4" type="video/mp4" />
                </video>
                */}
                <video id="peerVideo" ref={peerVideo} width="50%" autoPlay />
                <video id="localVideo" ref={localVideo} width="50%" autoPlay muted />
            </Box>
            <Box className="video-control" direction="row" justify="end">
                <Button icon={<Camera />} active={video} onClick={() => toggleMediaDevice('video')} />
                <Button icon={<Volume />} active={audio} onClick={() => toggleMediaDevice('audio')} />
                <Button icon={<FormClose />} onClick={() => endCall(true)} />
            </Box>
        </Box>
    );
}
