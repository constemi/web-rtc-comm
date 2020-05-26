import React from 'react';
import { Box } from 'grommet';
import { ChatInput } from './ChatInput.component';
import { ChatMessage } from './ChatMessage.component';
import { Message } from '../core/types';

interface Props {
    clientId: string;
    messages: Message[];
    sendMessage: (message: string) => void;
}

export function ChatContainer({ clientId, messages, sendMessage }: Props): React.ReactElement {
    return (
        <Box fill background="#25282c" elevation="small">
            <Box fill direction="column-reverse">
                <Box flex={false} overflow="auto">
                    {messages.map((message: Message, index: number) => (
                        <ChatMessage key={`message-${index}`} clientId={clientId} message={message} />
                    ))}
                </Box>
            </Box>
            <ChatInput sendMessage={sendMessage} />
        </Box>
    );
}
