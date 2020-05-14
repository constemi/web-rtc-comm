import React, { Component } from 'react';
import { Box, Button, Collapsible, Heading, Layer, Grommet, ResponsiveContext } from 'grommet';
import { FormClose, Chat } from 'grommet-icons';
import { MainWindow, CallWindow, CallModal } from './components';
import { PeerConnection } from './core';

import socket from './socket';

const theme = {
    global: {
        colors: {
            brand: '#6163ff',
        },
        font: {
            family: 'Inter, sans-serif',
            size: '18px',
            height: '20px',
        },
    },
};

interface Props {}
interface State {
    clientId: string;
    callWindow: string;
    callModal: string;
    callFrom: string;
    localSrc: any;
    peerSrc: any;
    sideBar: boolean;
}

interface Config {
    audio: boolean;
    video: boolean;
}

type Connection = PeerConnection | Record<string, any>;

const AppBar = (props: any) => (
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

class App extends Component<Props, State> {
    state: State = {
        clientId: '',
        callWindow: '',
        callModal: '',
        callFrom: '',
        localSrc: null,
        peerSrc: null,
        sideBar: false,
    };

    public connection: Connection = {};
    public config: any = {};

    public componentDidMount() {
        socket
            .on('init', (connect: any) => {
                document.title = `${connect.id} - VideoCall`;
                this.setState({ clientId: connect.id });
            })
            .on('request', (request: any) => {
                this.setState({ callModal: 'active', callFrom: request.from });
            })
            .on('call', (data: any) => {
                if (data.sdp) {
                    this.connection.setRemoteDescription(data.sdp);
                    if (data.sdp.type === 'offer') {
                        this.connection.createAnswer();
                    } else {
                        this.connection.addIceCandidate(data.candidate);
                    }
                }
            })
            .on('end', this.endCall.bind(this, false))
            .emit('init');
    }

    private startCall = (isCaller: boolean, friendID: string, config: Config): void => {
        this.config = config;
        this.connection = new PeerConnection(friendID)
            .on('localStream', (src: any) => {
                this.setState((prevState: State) => ({
                    callWindow: 'active',
                    localSrc: src,
                    callModal: !isCaller ? '' : prevState.callModal,
                }));
            })
            .on('peerStream', (src: any) => this.setState({ peerSrc: src }))
            .start(isCaller, config);
    };

    private rejectCall = (): void => {
        const { callFrom } = this.state;
        socket.emit('end', { to: callFrom });
        this.setState({ callModal: '' });
    };

    private endCall = (isStarter: boolean): void => {
        if (typeof this.connection.stop === 'function') {
            this.connection.stop(isStarter);
        }
        this.connection = {};
        this.config = {};
        this.setState({
            callWindow: '',
            callModal: '',
            localSrc: null,
            peerSrc: null,
        });
    };

    private showSideBar = (): void => {
        this.setState((prevState) => ({ sideBar: !prevState.sideBar }));
    };

    public render(): React.ReactNode {
        const { clientId, callFrom, callModal, callWindow, localSrc, peerSrc, sideBar } = this.state;
        return (
            <Grommet full theme={theme} themeMode="dark">
                <ResponsiveContext.Consumer>
                    {(size) => (
                        <Box fill>
                            <AppBar>
                                <Heading level="3" margin="none">
                                    WebRTC-link
                                </Heading>
                                <Button icon={<Chat />} onClick={this.showSideBar} />
                            </AppBar>
                            <Box background="#151719" direction="row" flex overflow={{ horizontal: 'hidden' }}>
                                <Box flex align="center" justify="center">
                                    <MainWindow clientId={clientId} startCall={this.startCall} />
                                    {Object.keys(this.config).length !== 0 && this.config.constructor === Object && (
                                        <CallWindow
                                            status={callWindow}
                                            localSrc={localSrc}
                                            peerSrc={peerSrc}
                                            config={this.config}
                                            mediaDevice={this.connection.mediaDevice}
                                            endCall={this.endCall}
                                        />
                                    )}
                                    <CallModal
                                        status={callModal}
                                        startCall={this.startCall}
                                        rejectCall={this.rejectCall}
                                        callFrom={callFrom}
                                    />
                                </Box>
                                <React.Fragment>
                                    {!sideBar || size !== 'small' ? (
                                        <Collapsible direction="horizontal" open={sideBar}>
                                            <Box
                                                flex
                                                width="medium"
                                                background="#25282c"
                                                elevation="small"
                                                align="center"
                                                justify="center"
                                            >
                                                sidebar
                                            </Box>
                                        </Collapsible>
                                    ) : (
                                        <Layer>
                                            <Box
                                                background="brand"
                                                tag="header"
                                                justify="end"
                                                align="center"
                                                direction="row"
                                            >
                                                <Button icon={<FormClose />} onClick={this.showSideBar} />
                                            </Box>
                                            <Box fill background="#25282c" align="center" justify="center">
                                                sidebar
                                            </Box>
                                        </Layer>
                                    )}
                                </React.Fragment>
                            </Box>
                        </Box>
                    )}
                </ResponsiveContext.Consumer>
            </Grommet>
        );
    }
}

export default App;
