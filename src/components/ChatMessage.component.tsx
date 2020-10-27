import React from 'react';
import { Box, Paragraph } from 'grommet';
import { Message } from '../core/types';

interface Props {
    message: Message;
    clientId: string;
}

export function ChatMessage({ message, clientId }: Props): React.ReactElement {
    const isClient = message.from === clientId ? 'dark-3' : '#151719';

    return (
        <Box round="small" background={isClient} margin={{ bottom: 'small', left: 'small', right: 'small' }}>
            <Paragraph size="small" margin="small">
                {message.content}
            </Paragraph>
        </Box>
    );
}
