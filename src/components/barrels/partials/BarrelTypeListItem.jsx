import React from 'react';

import * as constants from 'config/constants';

import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

require('styles/barrels/BarrelTypeListItem.scss');

/**
 * This component show a ListItem for a BarrelType
 * @param {BarrelType} type
 * @param {int} count Number of elements in this type
 * @param {function(Type)} onSelection callend on click
 */
export default class BarrelTypeListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
            count: props.count
        };

        // binding
        this._handleSelection = this._handleSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type,
            count: nextProps.count
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
        if(this.props.count !== undefined) {
            secondaryText = (this.state.count > 1) ? this.state.count + ' fûts' :  this.state.count + ' fût';
        }

        return (
            <ListItem
                className="BarrelTypeListItem"
                primaryText={this.state.type.name}
                secondaryText={secondaryText}
                leftAvatar={<Avatar className="BarrelTypeListItem__avatar">{this.state.type.shortName}</Avatar>}
                onTouchTap={this._handleSelection}
            />
        );
    }

}
