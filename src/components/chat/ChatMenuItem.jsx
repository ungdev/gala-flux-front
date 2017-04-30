import React from 'react';

import { ListItem } from 'material-ui/List';

export default class ChatMenuItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newMessages: props.newMessages,
            channel: props.channel
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            newMessages: nextProps.newMessages,
            channel: nextProps.channel
        });
    }

    render() {
        return (
            <ListItem
                value={this.state.channel}
                className="ChatMenu__channel"
            >
                {
                    this.state.newMessages &&
                        <span>
                            ({this.state.newMessages})
                        </span>

                }
                {this.state.channel.split(':')[1]}
            </ListItem>
        );
    }

}