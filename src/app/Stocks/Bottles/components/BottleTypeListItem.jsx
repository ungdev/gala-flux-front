import React from 'react';

import * as constants from 'config/constants';

import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

require('./BottleTypeListItem.scss');

/**
 * This component show a ListItem for a BottleType
 * @param {BottleType} type
 * @param {int} count Number of elements in this type
 * @param {function(Type)} onSelection callend on click
 */
export default class BottleTypeListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
        };

        // binding
        this.handleSelection = this.handleSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type
        });
    }

    /**
     * Call the service to update the type
     */
    handleSelection() {
        this.props.onSelection(this.props.type);
    }

    render() {
        let secondaryText = '';
        if(this.state.type.originalStock !== undefined) {
            secondaryText = (this.state.type.originalStock > 1) ? this.state.type.originalStock + ' bouteilles' :  this.state.type.originalStock + ' bouteille';
            if(this.state.type.quantityPerBox > 1) {
                let box = parseInt(this.state.type.originalStock/this.state.type.quantityPerBox);
                let bottleLeft = parseInt(this.state.type.originalStock%this.state.type.quantityPerBox);
                if(box >= 1 && bottleLeft == 0) {
                    secondaryText = (box > 1 ? box + ' cartons' :  box + ' carton') + ' (' + secondaryText + ')';
                }
                else if(box >= 1) {
                    secondaryText = (box > 1 ? box + ' cartons' :  box + ' carton') + ' et ' +
                    (bottleLeft > 1 ? bottleLeft + ' bouteilles' :  bottleLeft + ' bouteille') + ' (' + secondaryText + ')';
                }
            }
        }

        return (
            <ListItem
                button
                onTouchTap={this.handleSelection}
            >
                <Avatar className="BottleTypeListItem__avatar">{this.state.type.shortName}</Avatar>
                <ListItemText primary={this.state.type.name} secondary={secondaryText} />
            </ListItem>
        );
    }

}
