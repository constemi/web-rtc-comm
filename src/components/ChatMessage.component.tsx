import React from 'react';
import { Box, Paragraph } from 'grommet';

export function ChatMessage({ message }: any): React.ReactElement {
    return (
        <Box margin={{ bottom: 'small', left: 'small', right: 'small' }} round="small" background="#151719">
            <Paragraph size="small" margin="small">
                {message}
            </Paragraph>
        </Box>
    );
}
