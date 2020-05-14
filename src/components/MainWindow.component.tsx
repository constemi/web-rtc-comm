import React, { useState } from 'react';
import { TextInput, Button, Heading } from 'grommet';
import { Video, Phone } from 'grommet-icons';

interface Props {
    clientId: string;
    startCall: (isCaller: boolean, friendID: string, config: Config) => void;
}

interface Config {
    audio: boolean;
    video: boolean;
}

export function MainWindow({ startCall, clientId }: Props): React.ReactElement {
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
        <div className="container main-window">
            <Heading level={2}>{`Hi, your id is: ${clientId}`}</Heading>
            <h4>Get started by calling a friend below</h4>
            <TextInput
                spellCheck={false}
                placeholder="Your friend ID"
                onChange={(event) => setFriendID(event.target.value as string)}
            />
            <Button icon={<Video />} onClick={callWithVideo(true)} disabled={!friendID} />
            <Button icon={<Phone />} onClick={callWithVideo(false)} disabled={!friendID} />
        </div>
    );
}
