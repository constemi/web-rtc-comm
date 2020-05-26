import React, { useEffect } from 'react';
import { Button, Box, Layer, Heading } from 'grommet';
import { Video, Phone, FormClose } from 'grommet-icons';
import { Config } from '../core/types';

interface Props {
    status: boolean;
    friendId: string;
    startStream: (isCaller: boolean, friendId: string, config: Config) => void;
    rejectStream: () => void;
}

export function StreamResponse({ status, friendId, startStream, rejectStream }: Props): React.ReactElement {
    const [show, setShow] = React.useState(status);

    const acceptWithVideo = (video: boolean) => {
        const config = { audio: true, video };
        return () => startStream(false, friendId, config);
    };

    useEffect(() => {
        setShow(status);
    }, [status]);

    const rejectAndClose = () => {
        rejectStream();
        setShow(false);
    };

    return (
        <React.Fragment>
            {show && (
                <Layer onEsc={() => setShow(false)} onClickOutside={() => setShow(false)}>
                    <Box background="brand" tag="header" justify="end" align="center" direction="row">
                        <Button icon={<FormClose />} onClick={() => setShow(false)} />
                    </Box>
                    <Box background="#25282c" direction="column" justify="center">
                        <Heading level={3} textAlign="center">{`${friendId} is calling`}</Heading>
                        <Box background="#25282c" direction="row" justify="between" pad="medium">
                            <Button icon={<Video />} margin="xsmall" label="Accept" onClick={acceptWithVideo(true)} />
                            <Button icon={<Phone />} margin="xsmall" label="Accept" onClick={acceptWithVideo(false)} />
                            <Button icon={<FormClose />} margin="xsmall" label="Reject" onClick={rejectAndClose} />
                        </Box>
                    </Box>
                </Layer>
            )}
        </React.Fragment>
    );
}
