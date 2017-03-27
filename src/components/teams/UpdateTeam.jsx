import React from 'react';

import { Dialog } from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Slide from 'material-ui/transitions/Slide';
import Text from 'material-ui/Text';
import Layout from 'material-ui/Layout';

export default class UpdateTeam extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: this.props.team,
            users: null
        }
    }

    render() {
        const style = {
            title: {
                flex: 1
            },
            main: {
                marginTop: 64
            }
        };

        return (
            <Dialog
                fullScreen
                open={this.props.show}
                onRequestClose={this.props.close}
                transition={<Slide direction="up" />}
            >
                <AppBar>
                    <Toolbar>
                        <Text type="title" style={style.title} colorInherit>{this.state.team.team.name}</Text>
                        <Button contrast onClick={this.props.close}>
                            close
                        </Button>
                    </Toolbar>
                </AppBar>
                <div style={style.main}>
                    <Layout container gutter={24}>
                        <Layout item xs={12} sm={6}>
                            add members
                        </Layout>
                        <Layout item xs={12} sm={6}>
                            team info
                        </Layout>
                    </Layout>
                </div>
            </Dialog>
        );
    }

}