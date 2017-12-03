import React from 'react';
import { browserHistory } from 'react-router'

import MessageService from 'services/MessageService';
import MessageStore from 'stores/MessageStore';
import NotificationStore from 'stores/NotificationStore';
import ChatActions from 'actions/ChatActions';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui-old/Subheader';
import SelectableListItem from 'app/components/SelectableListItem.jsx';
import NotificationBubble from 'app/components/NotificationBubble.jsx';
import FontAwesome from 'react-fontawesome';
import { ListItem } from 'material-ui/List';
import ReactTooltip from 'react-tooltip'
import { withStyles } from 'material-ui/styles';
import { red } from 'material-ui/colors';


const styles = theme => ({
    listItem: {
        fontSize: '0.8em',
        paddingLeft: '10px',
    },
    bell: {
        marginRight: '4px',
    },
    leftIcon: {
        marginRight: '4px',
    },
});

/**
 * This component will print the list of available channels and let user change page
 * @param {bool} selectDefault enable default flag on the default channel item to be selected when nothing is set
 */
class ChannelList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: [],
            newMessages: NotificationStore.newMessageCounts,
        };

        // binding
        this.updateChannelList = this.updateChannelList.bind(this);
        this.handleNewMessages = this.handleNewMessages.bind(this);
    }

    componentDidMount() {

        this.updateChannelList();

        // Listen store change
        NotificationStore.addChangeListener(this.handleNewMessages);
    }

    componentWillUnmount() {
        // remove the store change listener
        NotificationStore.removeChangeListener(this.handleNewMessages);
    }

    updateChannelList() {
        let ordered = [];

        let channelConfig = NotificationStore.configuration.channel;
        for (let channel in channelConfig) {
            if(channelConfig[channel] != 'hide') {
                // Create channel label
                let label = channel.split(':')[1];
                let leftIcon = '';
                let notify = true;
                if(channel.split(':')[0] == 'private') {
                    leftIcon = 'user-secret';
                }
                else if(channel.split(':')[0] == 'group') {
                    leftIcon = 'bullhorn';
                }
                if(channelConfig[channel] != 'notify') {
                    notify = false;
                }

                ordered.push({channel, label, leftIcon, notify});
            }
        }
        ordered = ordered.sort((a,b) => {
            let chanA = a.channel;
            let chanB = b.channel;

            // Personnal channel first
            if(AuthStore.team) {
                chanA = (a.channel.split(':')[1] == AuthStore.team.name ? '0' : '1') +  chanA;
                chanB = (b.channel.split(':')[1] == AuthStore.team.name ? '0' : '1') +  chanB;
            }

            // General first
            chanA = (a.channel.split(':')[1] == 'General' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[1] == 'General' ? '0' : '1') +  chanB;

            // order public, group, private
            chanA = (a.channel.split(':')[0] == 'group' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[0] == 'group' ? '0' : '1') +  chanB;
            chanA = (a.channel.split(':')[0] == 'public' ? '0' : '1') +  chanA;
            chanB = (b.channel.split(':')[0] == 'public' ? '0' : '1') +  chanB;

            // put 'notify' first
            chanA = (a.notify ? '0' : '1') + chanA;
            chanB = (b.notify ? '0' : '1') + chanB;

            return chanA.localeCompare(chanB);
        });

        this.setState({channels: ordered});
    }

    /**
     * Set the new messages counters in the state
     */
    handleNewMessages() {
        this.setState({ newMessages: NotificationStore.newMessageCounts });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            {
                Object.keys(this.state.channels).map((key, i) => {
                    let channel = this.state.channels[key].channel;
                    return (
                        <SelectableListItem
                            dense
                            key={channel}
                            value={'/chat/' + channel}
                            className={classes.listItem + ' NotificationScrollIndicatorLine'}
                            data-notification-count={(this.state.channels[key].notify && this.state.newMessages[channel]) || 0}
                        >
                            { this.state.channels[key].notify &&
                                <NotificationBubble count={this.state.newMessages[channel]} />
                            }
                            {!this.state.channels[key].notify &&
                                <FontAwesome className={classes.bell} name="bell-slash-o" />
                            }

                            {this.state.channels[key].leftIcon &&
                                <FontAwesome className={classes.leftIcon} name={this.state.channels[key].leftIcon} />
                            }

                            {this.state.newMessages[channel] > 0 ?
                                <strong>{this.state.channels[key].label}</strong>
                                :
                                this.state.channels[key].label
                            }
                        </SelectableListItem>
                    )
                })
            }
            </div>
        );
    }
}
export default withStyles(styles)(ChannelList);
