import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import List, {  ListItem,  ListItemIcon,  ListItemSecondaryAction,  ListItemText,  ListSubheader } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import NotificationsIcon from 'material-ui-icons/Notifications';
import NotificationsOffIcon from 'material-ui-icons/NotificationsOff';
import VisibilityOffIcon from 'material-ui-icons/VisibilityOff';

import Divider from 'material-ui/Divider';
import { FormLabel, FormControl } from 'material-ui/Form';
import Radio from 'material-ui/Radio';

const styles = theme => ({
    radioFormControl: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        flexGrow: '1',
        overflow: 'hidden',
    },
});


/**
 * Channel configuration row on NotificationDialog
 * @param {function(value)} onChange function called when the value of the channel change
 * @param {string} label Channel name or label
 * @param {string} value 'hide', 'show', 'notify'
 * @param {bool} disabled Let you disable all inputs
 * @param {bool} hiddenOption Let you disable the hidden option (default:true)
 */
class NotificationConfigRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            label: this.getLabel(props.label),
        };

        // binding
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            label: this.getLabel(nextProps.label),
        })
    }

    handleChange(e) {
        if(this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }

    getLabel(label) {
        let ar = label.split(':');
        label = ar[1];
        if(label) {
            switch(ar[0]) {
                case 'group': label = 'Channel de groupe : ' + ar[1]; break;
                case 'private': label = 'Channel privé : ' + ar[1]; break;
            }
        }
        else {
            label = ar[0];
        }
        return label;
    }

    render() {
        const { classes, onChange, channel, value, disabled, hiddenOption, ...props } = this.props
        return (
        <div {...props}>
            <FormControl
                className={classes.radioFormControl}
                disabled={disabled}
            >
                <FormLabel
                    className={classes.radioLabel}
                >
                    {this.state.label}
                </FormLabel>
                <Radio
                    checked={value == 'hide'}
                    onClick={this.handleChange}
                    value="hide"
                    name={channel}
                    aria-label="hide"
                />
                {hiddenOption !== false &&
                    <Radio
                        checked={value == 'show'}
                        onClick={this.handleChange}
                        value="show"
                        name={channel}
                        aria-label="show"
                    />
                }
                <Radio
                    checked={value == 'notify'}
                    onClick={this.handleChange}
                    value="notify"
                    name={channel}
                    aria-label="notify"
                />
            </FormControl>
            <Divider/>
        </div>
        );
    }

}

export default withStyles(styles)(NotificationConfigRow);
