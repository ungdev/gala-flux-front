import React from 'react';

import * as constants from 'config/constants';

import { ListItemText, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    avatar: {
        backgroundColor: theme.palette.primary[700],
        fontSize: '16px',
    },
})

/**
 * This component show a ListItem for a BarrelType
 * @param {BarrelType} type
 * @param {int} count Number of elements in this type
 * @param {function(Type)} onSelection callend on click
 */
class BarrelTypeListItem extends React.Component {

    constructor(props) {
        super(props);

        // binding
        this.handleSelection = this.handleSelection.bind(this);
    }

    /**
     * Call the service to update the type
     */
    handleSelection() {
        this.props.onSelection(this.props.type);
    }

    render() {
        const { classes } = this.props;
        let secondaryText = '';
        if(this.props.count !== undefined) {
            secondaryText = (this.props.count > 1) ? this.props.count + ' fûts' :  this.props.count + ' fût';
        }

        return (
            <ListItem
                button
                onTouchTap={this.handleSelection}
            >
                <Avatar className={classes.avatar}>{this.props.type.shortName}</Avatar>
                <ListItemText primary={this.props.type.name} secondary={secondaryText} />
            </ListItem>
        );
    }
}
export default withStyles(styles)(BarrelTypeListItem);
