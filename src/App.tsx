// tslint:disable-next-line
import adapter from 'webrtc-adapter';

import React, { Component } from 'react';
import { FormClose, Chat } from 'grommet-icons';
import { Box, Button, Collapsible, Heading, Layer, Grommet, ResponsiveContext } from 'grommet';
import { AppBar, StreamRequest, StreamDisplay, StreamResponse, ChatContainer } from './components';
import { PeerConnection, isEmpty } from './core';

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
    friendId: string;
    callWindow: string;
    callModal: string;
    sideBar: boolean;
    messages: any;
    localSrc: MediaStream | null;
    peerSrc: MediaStream | null;
}

interface Config {
    audio: boolean;
    video: boolean;
}

type Connection = PeerConnection | Record<string, any>;

class App extends Component<Props, State> {
    state: State = {
        clientId: '',
        friendId: '',
        callWindow: '',
        callModal: '',
        localSrc: null,
        peerSrc: null,
        sideBar: false,
        messages: [],
    };

    public connection: Connection = {};
    public config: any = {};

    public componentDidMount() {
        socket
            .on('init', (connection: any) => {
                document.title = `${connection.id} - VideoCall`;
                this.setState({ clientId: connection.id });
            })
            .on('request', (request: any) => {
                console.debug(`call request from ${request.from}`);
                this.setState({ callModal: 'active', friendId: request.from });
            })
            .on('call', (data: any) => {
                if (data.sdp) {
                    this.connection.setRemoteDescription(data.sdp);
                    if (data.sdp.type === 'offer') this.connection.createAnswer();
                } else this.connection.addIceCandidate(data.candidate);
            })
            .on('end', this.closeStream.bind(this, false))
            .emit('init');
    }

    private startStream = (isCaller: boolean, friendId: string, config: Config): void => {
        this.config = config;
        this.connection = new PeerConnection(friendId)
            .on('localStream', (localSrc: MediaStream) => {
                const newState: Partial<State> = { callWindow: 'active', localSrc };
                if (!isCaller) newState.callModal = '';
                this.setState((prevState) => ({ ...prevState, ...newState }));
            })
            .on('peerStream', (peerSrc: MediaStream) => this.setState({ peerSrc }))
            .on('chatMessage', (message: any) =>
                this.setState((prevState) => ({
                    messages: [...prevState.messages, message],
                })),
            )
            .start(isCaller, config);
    };

    private rejectStream = (): void => {
        socket.emit('end', { to: this.state.friendId });
        this.setState({ callModal: '' });
    };

    private closeStream = (isStarter: boolean): void => {
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

    private sendMessage = (message: string): void => {
        if (this.connection instanceof PeerConnection)
            this.connection.emit('chatMessage', { sent: Date.now(), author: this.state.clientId, content: message });
    };

    private showSideBar = (): void => {
        this.setState((prevState) => ({ sideBar: !prevState.sideBar }));
    };

    public render(): React.ReactNode {
        const { clientId, friendId, callModal, localSrc, peerSrc, sideBar, messages } = this.state;

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
                                    {isEmpty(this.config) ? (
                                        <StreamRequest clientId={clientId} startStream={this.startStream} />
                                    ) : (
                                        <StreamDisplay
                                            peerSrc={peerSrc}
                                            localSrc={localSrc}
                                            config={this.config}
                                            closeStream={this.closeStream}
                                            mediaDevice={this.connection.mediaDevice}
                                        />
                                    )}
                                    <StreamResponse
                                        status={callModal}
                                        friendId={friendId}
                                        startStream={this.startStream}
                                        rejectStream={this.rejectStream}
                                    />
                                </Box>
                                <React.Fragment>
                                    {!sideBar || size !== 'small' ? (
                                        <Collapsible direction="horizontal" open={sideBar}>
                                            <ChatContainer
                                                clientId={clientId}
                                                messages={messages}
                                                sendMessage={this.sendMessage}
                                            />
                                        </Collapsible>
                                    ) : (
                                        <Layer>
                                            <Box
                                                background="brand"
                                                tag="header"
                                                justify="end"
                                                align="center"
                                                direction="row"
                                                style={{ zIndex: 1 }}
                                            >
                                                <Button icon={<FormClose />} onClick={this.showSideBar} />
                                            </Box>
                                            <ChatContainer
                                                clientId={clientId}
                                                messages={messages}
                                                sendMessage={this.sendMessage}
                                            />
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
