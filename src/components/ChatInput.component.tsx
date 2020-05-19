import React, { useState } from 'react';
import { Button, Box, TextInput, Footer, Keyboard } from 'grommet';
import { Send } from 'grommet-icons';

export function ChatInput({ sendMessage }: any): React.ReactElement {
    const [value, setValue] = useState('');

    const onSendMessage = () => {
        if (value) {
            sendMessage(value);
            setValue('');
        }
    };

    return (
        <Footer background="#151719" pad="medium" justify="end">
            <Box fill direction="row" gap="xxsmall">
                <Keyboard onEnter={onSendMessage}>
                    <TextInput
                        spellCheck
                        placeholder="Chat Message"
                        value={value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
                    />
                </Keyboard>
                <Button
                    alignSelf="end"
                    icon={<Send color="brand" />}
                    disabled={!Boolean(value)}
                    onClick={onSendMessage}
                />
            </Box>
        </Footer>
    );
}
