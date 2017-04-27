import React from 'react';

import * as constants from '../../../config/constants';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

require('../../../styles/bottles/BottleTypeListItem.scss');

/**
 * This component show a ListItem for a BottleType
 * @param {BottleType} type
 * @param {int} count Number of elements in this type
 * @param {function(Type)} onSelection callend on click
 */
export default class BottleTypeListItem extends React.Component {

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
        if(this.props.originalStock !== undefined) {
            secondaryText = (this.props.originalStock > 1) ? this.props.originalStock + ' fûts' :  this.props.originalStock + ' fût';
        }

        return (
            <ListItem
                className="BottleTypeListItem"
                primaryText={this.props.type.name}
                secondaryText={secondaryText}
                leftAvatar={<Avatar className="BottleTypeListItem__avatar">{this.props.type.shortName}</Avatar>}
                onTouchTap={this._handleSelection}
            />
        );
    }

}
