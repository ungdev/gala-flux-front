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

        this.state = {
            type: props.type,
        };

        // binding
        this._handleSelection = this._handleSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type
        });
    }

    /**
     * Call the service to update the type
     */
    _handleSelection() {
        this.props.onSelection(this.props.type);
    }

    render() {
        let secondaryText = '';
        if(this.state.type.originalStock !== undefined) {
            secondaryText = (this.state.type.originalStock > 1) ? this.state.type.originalStock + ' caisses' :  this.state.type.originalStock + ' caisse';
        }

        return (
            <ListItem
                className="BottleTypeListItem"
                primaryText={this.state.type.name}
                secondaryText={secondaryText}
                leftAvatar={<Avatar className="BottleTypeListItem__avatar">{this.state.type.shortName}</Avatar>}
                onTouchTap={this._handleSelection}
            />
        );
    }

}
