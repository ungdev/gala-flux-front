import React from 'react';
import { browserHistory } from 'react-router'

import MessageService from 'services/MessageService';
import MessageStore from 'stores/MessageStore';
import NotificationStore from 'stores/NotificationStore';
import ChatActions from 'actions/ChatActions';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';
import Divider from 'material-ui/Divider';
import SelectableListItem from 'app/components/SelectableListItem.jsx';
import FontAwesome from 'react-fontawesome';
import { ListItem } from 'material-ui/List';
import ReactTooltip from 'react-tooltip'
import { withStyles } from 'material-ui/styles';
import { red } from 'material-ui/colors';

const styles = theme => ({
    root: {
        backgroundColor: red[600],
        borderRadius: '15px',
        color: 'white',
        padding: '2px',
        marginRight: '4px',
        marginLeft: '2px',
        fontSize: '0.8em',
        minWidth: '1em',
        textAlign: 'center',
        display: 'inline-block',
    },
});

/**
 * Red notification bubble
 * @param [int] count Number of notification. Will be hidden if < 1
 */
class NotificationBubble extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        if(!this.props.count) {
            return null;
        }

        return (
            <span className={classes.root}>{this.props.count}</span>
        );
    }
}
export default withStyles(styles)(NotificationBubble);
