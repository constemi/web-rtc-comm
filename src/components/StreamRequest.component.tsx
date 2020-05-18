import React, { useState } from 'react';
import { Box, TextInput, Button, Heading } from 'grommet';
import { Video, Phone } from 'grommet-icons';

interface Props {
    clientId: string;
    startCall: (isCaller: boolean, friendID: string, config: Config) => void;
}

interface Config {
    audio: boolean;
    video: boolean;
}

export function StreamRequest({ startCall, clientId }: Props): React.ReactElement {
    const [friendID, setFriendID] = useState('');

    /**
     * Start the call with or without video
     * @param {Boolean} video
     */
    const callWithVideo = (video: boolean) => {
        const config = { audio: true, video };
        return () => friendID && startCall(true, friendID, config);
    };

    return (
        <Box className="container main-window" animation="zoomIn">
            <Heading level={2}>{`Hi, your id is: ${clientId}`}</Heading>
            <Heading level={4}>Get started by calling a friend below</Heading>
            <TextInput
                spellCheck={false}
                placeholder="Your friend ID"
                onChange={(event) => setFriendID(event.target.value as string)}
            />
            <Box direction="row">
                <Button icon={<Video />} onClick={callWithVideo(true)} disabled={!friendID} />
                <Button icon={<Phone />} onClick={callWithVideo(false)} disabled={!friendID} />
            </Box>
        </Box>
    );
}
