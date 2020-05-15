import React, { useEffect } from 'react';
import { Button, Box, Layer, Heading } from 'grommet';
import { Video, Phone, FormClose } from 'grommet-icons';

interface Props {
    status: string;
    callFrom: string;
    startCall: (isCaller: boolean, friendID: string, config: Config) => void;
    rejectCall: () => void;
}

interface Config {
    audio: boolean;
    video: boolean;
}

export function CallModal({ status, callFrom, startCall, rejectCall }: Props): React.ReactElement {
    const [show, setShow] = React.useState(status);

    const acceptWithVideo = (video: boolean) => {
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config);
    };

    useEffect(() => {
        setShow(status);
    }, [status]);

    const rejectAndClose = () => {
        rejectCall();
        setShow('');
    };

    return (
        <React.Fragment>
            {show && (
                <Layer onEsc={() => setShow('')} onClickOutside={() => setShow('')}>
                    <Box background="brand" tag="header" justify="end" align="center" direction="row">
                        <Button icon={<FormClose />} onClick={() => setShow('')} />
                    </Box>
                    <Box background="#25282c" direction="column" justify="center">
                        <Heading level={3} textAlign="center">{`${callFrom} is calling`}</Heading>
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
