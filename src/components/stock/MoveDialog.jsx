import React from 'react';

import BarrelService from '../../services/BarrelService';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import LocationSelect from './LocationSelect.jsx';

export default class MoveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: props.barrels,
            teams: props.teams,
            team: null
        };

        // binding
        this._moveBarrels = this._moveBarrels.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrels: nextProps.barrels,
            teams: nextProps.teams
        });
    }

    _moveBarrels() {
        BarrelService.moveBarrels(this.state.barrels, this.state.team)
            .catch(error => console.log("Move barrels error", error));
    }

    render() {
        const actions = [
            <FlatButton
                label="Déplacer"
                primary={true}
                onClick={this._moveBarrels}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />
        ];

        const styles = {
            chip: {
                display: "inline-block"
            }
        };

        return (
            <div>
                {
                    this.state.barrels && this.state.teams &&
                    <Dialog
                        title={"Déplacement de fûts"}
                        open={this.props.show}
                        modal={true}
                        onRequestClose={this.props.close}
                        actions={actions}
                    >
                        <LocationSelect
                            teams={this.state.teams}
                            value={this.state.team}
                            setValue={(e, i, v) => this.setState({ team: v })}
                        />
                        {
                            this.state.barrels.map((barrel, i) => {
                                return <Chip key={i} style={styles.chip}>{barrel.reference}</Chip>
                            })
                        }
                    </Dialog>
                }
            </div>
        );
    }

}
