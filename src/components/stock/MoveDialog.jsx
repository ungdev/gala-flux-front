import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import BarrelService from 'services/BarrelService';
import BottleActionService from 'services/BottleActionService';
import BottleTypeStore from 'stores/BottleTypeStore';
import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import TeamStore from 'stores/TeamStore';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import BarrelChip from 'components/barrels/partials/BarrelChip.jsx';
import BottleChip from 'components/bottles/partials/BottleChip.jsx';
import LocationSelect from 'components/stock/LocationSelect.jsx';

export default class MoveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: props.barrels,
            bottles: props.bottles,
            teams: props.teams,
            team: null
        };

        // binding
        this._moveBarrels = this._moveBarrels.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            barrels: props.barrels,
            bottles: props.bottles,
            teams: props.teams
        });
    }

    /**
     * Call the service method to update the location of the selected barrels
     */
    _moveBarrels() {
        BarrelService.moveBarrels(this.state.barrels, this.state.team)
        .then(_ => {

            // Prepare to move bottles
            let promises = [];
            for (let teamId in this.state.bottles) {
                for (let typeId in this.state.bottles[teamId]) {
                    promises.push(BottleActionService.create({
                            teamId: this.state.team,
                            fromTeamId: teamId && teamId != 'null' ? teamId : null,
                            typeId: typeId && typeId != 'null' ? typeId : null,
                            quantity: this.state.bottles[teamId][typeId],
                            operation: 'moved',
                        })
                    );
                }
            }
            return Promise.all(promises);
        })
        .then(_ => {
            this.props.close(true);
            NotificationActions.snackbar("Les fûts et bouteilles ont bien été déplacés.");
        })
        .catch(error => NotificationActions.error("Erreur lors du déplacement des fûts et bouteilles.", error));
    }

    render() {
        const actions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />,
            <FlatButton
                label="Déplacer"
                primary={true}
                onClick={this._moveBarrels}
            />
        ];

        return (
            <div>
                {
                    this.state.barrels && this.state.teams &&
                    <Dialog
                        title={"Déplacement de fûts"}
                        open={this.props.show}
                        modal={false}
                        onRequestClose={this.props.close}
                        actions={actions}
                    >
                        <p>
                            Les fûts et bouteilles suivantes vont être déplacés.
                        </p>

                        <div className="BarrelChipContainer">
                            {
                                this.state.barrels.map((id, i) => {
                                    let barrel = BarrelStore.findById(id);
                                    return <BarrelChip
                                                key={i}
                                                barrel={barrel}
                                                team={TeamStore.findById(barrel.teamId)}
                                                type={BarrelTypeStore.findById(barrel.typeId)}
                                            />
                                })
                            }
                            {
                                Object.keys(this.state.bottles).map(teamId => {
                                    let team = TeamStore.findById(teamId);
                                    return Object.keys(this.state.bottles[teamId]).map(typeId => {
                                        let type = BottleTypeStore.findById(typeId);
                                        return  <BottleChip
                                            key={(teamId + typeId)}
                                            count={this.state.bottles[teamId][typeId]}
                                            state="new"
                                            type={type}
                                            team={team}
                                        />
                                    })
                                })
                            }
                        </div>

                        <LocationSelect
                            teams={this.state.teams}
                            value={this.state.team}
                            setValue={(e, i, v) => this.setState({ team: v })}
                            floatingLabel="Destination"
                        />
                    </Dialog>
                }
            </div>
        );
    }

}
