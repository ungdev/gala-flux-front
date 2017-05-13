import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ReactTooltip from 'react-tooltip';
import * as color from 'material-ui/styles/colors';
import BottleSelectionDialog from 'components/bottles/dialogs/BottleSelectionDialog.jsx';

require('styles/bottles/BottleChip.scss');


/**
 * This component will print a pin representing state of a bottle type
 * @param {int} count Number of bottle of this type in this state
 * @param {string} state State of thoses bottles between `new`, `opened` and `empty`
 * @param {BottleType} type type of the bottle
 * @param {Team} team Necessary for selection, team owner of bottles
 * @param {function(bottleType, team, count)} onSelection Will be called when the chip is clicked only in selection mode
 * @param {function(bottleType, team)} onClick Will be called when the chip is clicked
 * @param {boolean} selectable (default:false), Set to true if you want the chip to keep its selected color after click
 * @param {int} selected number of selected bottle
 */
export default class BottleChip extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            count: props.count,
            state: props.state,
            type: props.type,
            team: props.team,
            selected: props.selected !== undefined ? props.selected : false
        };

        // binding
        this._handleClick = this._handleClick.bind(this);
        this._handleSelectSubmit = this._handleSelectSubmit.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.count,
            state: nextProps.state,
            type: nextProps.type,
            team: nextProps.team,
            selected: nextProps.selected
        });
    }

    _handleClick() {
        if (this.props.selectable && this.props.onSelection) {
            this.setState({showSelectDialog: true});
        }
        if (this.props.onClick) {
            this.props.onClick(this.state.type, this.state.team);
        }
    }

    _handleSelectSubmit(newCount) {
        this.setState({showSelectDialog: false});
        if (this.props.selectable && this.props.onSelection) {
            this.props.onSelection(this.state.type, this.state.team, newCount);
        }
    }

    render() {
        // Don't show anything if we miss data
        if(!this.state.type || ! this.state.count) {
            return null;
        }

        // Color selection
        let background = null;
        let avatarBackground = null;
        switch(this.state.state) {
            case 'new':
                background = this.state.selected ? color.teal300 : color.teal100;
                avatarBackground = color.teal600;
                break;
            case 'opened':
                background = this.state.selected ? color.orange300 : color.orange100;
                avatarBackground = color.orange600;
                break;
            case 'empty':
            default:
                background = this.state.selected ? color.red300 : color.red100;
                avatarBackground = color.red600;
                break;

        }

        // Tooltip generation
        let tooltipH = this.state.type.name;
        if(this.state.team) {
            tooltipH = this.state.type.name + ' - ' + this.state.team.name;
        }

        // Calculate number of boxes
        let box = this.state.type.quantityPerBox > 1 ? Math.round(this.state.count * 10 / this.state.type.quantityPerBox) / 10 : 0;
        let bottleLeft = this.state.type.quantityPerBox > 1 ? this.state.count % this.state.type.quantityPerBox : this.state.count;
        let selectedBox = this.state.selected ? Math.round(this.state.selected * 10 / this.state.type.quantityPerBox) / 10 : 0;

        return (
            <Chip
                className="BottleChip"
                backgroundColor={background}
                onRequestDelete={this.props.onRequestDelete ? (() => this.props.onRequestDelete(this.state.bottleType)) : null}
                onTouchTap={((this.props.selectable && this.props.onSelection) || this.props.onClick) ? this._handleClick : undefined}
                data-tip
                data-for={'BottleChip-' + this.state.count + '-' + this.state.state + '-' + this.state.type + '-' + this.state.team}
            >
                <Avatar className="BottleChip__shortname"  backgroundColor={avatarBackground}>
                    {this.state.type.shortName}
                </Avatar>
                <span
                    className="BottleChip__content"
                    style={{fontWeight: this.state.selected ? 'bold': 'normal'}}
                >
                    {( this.state.type.quantityPerBox > 1 && box >= 2 && (!selectedBox || Number.isInteger(selectedBox))  ?
                        (this.state.selected ? selectedBox +'/' : '') + box + ' carton' + (box>1?'s':'')
                        :
                        (this.state.selected ? this.state.selected +'/' : '') + this.state.count + ' bouteille' + (this.state.count>1?'s':'')
                    )}
                </span>

                {this.state.showSelectDialog &&
                    <BottleSelectionDialog
                        show={this.state.showSelectDialog}
                        type={this.state.type}
                        count={this.state.count}
                        selected={this.state.selected}
                        close={_ => this.setState({showSelectDialog: false})}
                        submit={this._handleSelectSubmit}
                     />
                }

                <ReactTooltip
                    id={'BottleChip-' + this.state.count + '-' + this.state.state + '-' + this.state.type + '-' + this.state.team}
                    place="bottom"
                    style={{textAlign: 'center', zIndex: '10'}}
                >
                    {(this.state.type && <span> {this.state.type.name} <br/></span>)}
                    {(this.state.team && <span> {this.state.team.name} <br/></span>)}
                    {(parseInt(box) + ' carton' + (parseInt(box)>1?'s ':' '))}
                    et {(bottleLeft + ' bouteille' + (bottleLeft>1?'s ':' '))} <br/>
                    {(this.state.selected ? this.state.selected +'/' : '') + this.state.count + ' bouteille' + (this.state.count>1?'s':'')}
                </ReactTooltip>
            </Chip>

        );
    }

}
