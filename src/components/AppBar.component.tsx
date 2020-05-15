import React from 'react';
import { Box } from 'grommet';

export const AppBar = (props: any) => (
    <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="brand"
        pad={{ left: 'large', right: 'large', vertical: 'xsmall' }}
        elevation="small"
        style={{ zIndex: '1' }}
        {...props}
    />
);
