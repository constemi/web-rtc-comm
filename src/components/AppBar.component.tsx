import React from 'react';
import { Box, BoxProps } from 'grommet';

interface Props extends BoxProps {
    children?: React.ReactNode;
}

export const AppBar: React.FC<Props> = (props): React.ReactElement => (
    <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="brand"
        pad={{ left: 'large', right: 'large', vertical: 'xsmall' }}
        elevation="small"
        style={{ zIndex: 1 }}
        {...props}
    />
);
