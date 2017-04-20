import React from 'react';

import * as constants from '../../../config/constants';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

require('../../../styles/barrels/BarrelTypeListItem.scss');

/**
 * This component show a ListItem for a BarrelType
 * @param {BarrelType} type
 * @param {int} count Number of elements in this type
 * @param {function(Type)} onSelection callend on click
 */
export default class BarrelTypeListItem extends React.Component {

    constructor(props) {
        super(props);

        // binding
        this._handleSelection = this._handleSelection.bind(this);
    }

    /**
     * Call the service to update the type
     */
    _handleSelection() {
        this.props.onSelection(this.props.type);
    }

    render() {
        let secondaryText = '';
        if(this.props.count !== undefined) {
            secondaryText = (this.props.count > 1) ? this.props.count + ' fûts' :  this.props.count + ' fût';
        }

        return (
            <ListItem
                className="BarrelTypeListItem"
                primaryText={this.props.type.name}
                secondaryText={secondaryText}
                leftAvatar={<Avatar className="BarrelTypeListItem__avatar">{this.props.type.shortName}</Avatar>}
                onTouchTap={this._handleSelection}
            />
        );
    }

}
