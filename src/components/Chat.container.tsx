import React from 'react';
import { Box } from 'grommet';
import { ChatInput } from './ChatInput.component';
import { ChatMessage } from './ChatMessage.component';

export function ChatContainer({ messages, sendMessage }: any): React.ReactElement {
    return (
        <Box fill background="#25282c" elevation="small" justify="start" overflow={{ vertical: 'hidden' }}>
            {messages.map((message: any, index: number) => (
                <ChatMessage key={`message-${index}`} message={message} />
            ))}

            <ChatInput sendMessage={sendMessage} />
        </Box>
    );
}
