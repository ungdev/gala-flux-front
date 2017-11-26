import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { teal, orange, red } from 'material-ui/colors';

require('./BarrelChip.scss');


/**
 * This component will print a pin representing a barrel
 * @param {Barrel} barrel
 * @param {BarrelType} type type of the barrel
 * @param {Team} team (optional) if given, the team name will be written in the tooltip
 * @param {function(barrel)} onRequestDelete Will be called when the "delete" button is pressed
 * @param {function(barrel, selected)} onSelection Will be called when the chip is clicked only in selection mode
 * @param {function(barrel)} onClick Will be called when the chip is clicked
 * @param {boolean} selectable (default:false), Set to true if you want the chip to keep its selected color after click
 * @param {boolean} selected (default:false), Set to true if you want the chip to keep its selected color after click
 */
export default class BarrelChip extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrel: props.barrel,
            type: props.type,
            team: props.team,
            selected: props.selected !== undefined ? props.selected : false
        };

        // binding
        this._handleClick = this._handleClick.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrel: nextProps.barrel,
            type: nextProps.type,
            team: nextProps.team,
            selected: nextProps.selected
        });
    }

    _handleClick() {
        if (this.props.selectable && this.props.onSelection) {
            this.props.onSelection(this.state.barrel, !this.state.selected);
        }
        if (this.props.onClick) {
            this.props.onClick(this.state.barrel);
        }
    }

    render() {
        // Don't show anything if we miss data
        if(!this.state.type || ! this.state.barrel) {
            return null;
        }

        // Color selection
        let background = null;
        let avatarBackground = null;
        switch(this.state.barrel.state) {
            case 'new':
                background = this.state.selected ? teal[300] : teal[100];
                avatarBackground = teal[600];
                break;
            case 'opened':
                background = this.state.selected ? orange[300] : orange[100];
                avatarBackground = orange[600];
                break;
            case 'empty':
            default:
                background = this.state.selected ? red[300] : red[100];
                avatarBackground = red[600];
                break;

        }

        // Tooltip generation
        let tooltip = this.state.type.name;
        if(this.state.team) {
            tooltip = this.state.type.name + ' - ' + this.state.team.name;
        }

        return (
            <Chip
                className="BarrelChip"
                style={{backgroundColor: background}}
                avatar={<Avatar className="BarrelChip__shortname"  style={{backgroundColor: avatarBackground}}>{this.state.type.shortName}</Avatar>}
                onRequestDelete={this.props.onRequestDelete ? (() => this.props.onRequestDelete(this.state.barrel)) : null}
                onClick={((this.props.selectable && this.props.onSelection) || this.props.onClick) ? this._handleClick : undefined}
                title={tooltip}
                label={<span
                        className="BarrelChip__number"
                        style={{fontWeight: this.state.selected ? 'bold': 'normal'}}
                    >
                        {this.state.barrel.num}
                    </span>}
                key={this.state.barrel.id}
            />

        );
    }

}
