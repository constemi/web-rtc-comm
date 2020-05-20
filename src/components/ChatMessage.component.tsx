import React from 'react';
import { Box, Paragraph } from 'grommet';

export function ChatMessage({ message, clientId }: any): React.ReactElement {
    const isClient = message.author === clientId ? 'dark-3' : '#151719';

    return (
        <Box round="small" background={isClient} margin={{ bottom: 'small', left: 'small', right: 'small' }}>
            <Paragraph size="small" margin="small">
                {message.content}
            </Paragraph>
        </Box>
    );
}
