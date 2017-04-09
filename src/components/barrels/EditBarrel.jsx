import React from 'react';

import BarrelService from '../../services/BarrelService';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Delete from 'material-ui/svg-icons/action/delete';

export default class EditBarrel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrel: props.barrel,
            teams: props.teams
        };

        // binding
        this._submitForm = this._submitForm.bind(this);
        this._deleteBarrel = this._deleteBarrel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrel: nextProps.barrel,
            teams: nextProps.teams
        });
    }

    /**
     * Update the value of the place
     *
     * @param {string|null} place : the team id, or null
     */
    _updateBarrelPlace(place) {
        let state = this.state;
        state.barrel.place = place;
        this.setState(state);
    }

    /**
     * Call the barrel service to delete this barrel
     */
    _deleteBarrel() {
        BarrelService.deleteBarrel(this.state.barrel.id ,(error, result) => {
            if (error) {
                console.log("delete barrel error", error);
            } else {
                this.props.close();
            }
        });
    }

    /**
     * Call the barrel service to update this barrel with the new data
     */
    _submitForm() {
        BarrelService.updateBarrel(this.state.barrel.id, this.state.barrel, (error, result) => {
            if (error) {
                console.log("update barrel error", error);
            } else {
                this.props.close();
            }
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="Assigner"
                primary={true}
                onClick={this._submitForm}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />,
            <RaisedButton
                secondary={true}
                icon={<Delete />}
                onClick={this._deleteBarrel}
            />
        ];

        return (
            <div>
                {
                    this.state.barrel &&
                    <Dialog
                        title={"Modification du fût '" + this.state.barrel.reference + "'"}
                        open={this.props.show}
                        modal={true}
                        onRequestClose={this.props.close}
                        actions={actions}
                    >
                        <SelectField
                            fullWidth={true}
                            onChange={(e, i, v) => this._updateBarrelPlace(v)}
                            value={this.state.barrel.place}
                            floatingLabelText="Assigner le fût à une team"
                        >
                            <MenuItem key={-1} value={null} primaryText={""} />
                            {
                                this.state.teams.map((team, i) => {
                                    return <MenuItem key={i} value={team.id} primaryText={team.name} />
                                })
                            }
                        </SelectField>
                    </Dialog>
                }
            </div>
        );
    }

}