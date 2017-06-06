import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import BarrelService from 'services/BarrelService';
import BottleActionService from 'services/BottleActionService';
import BottleTypeStore from 'stores/BottleTypeStore';
import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import TeamStore from 'stores/TeamStore';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import BarrelChip from 'app/Stocks/Barrels/components/BarrelChip.jsx';
import BottleChip from 'app/Stocks/Bottles/components/BottleChip.jsx';
import LocationSelect from 'app/Stocks/components/LocationSelect.jsx';

/**
 * @param {boolean} show
 * @param {functon} close
 * @param {ModelCollection} teams
 * @param {Object} barrels
 * @param {Object} bottles
 * @param {Object} barrelTypes
 * @param {Object} bottleTypes
*/
export default class MoveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teamId: null
        };

        // binding
        this._moveBarrels = this._moveBarrels.bind(this);
    }

    /**
     * Call the service method to update the location of the selected barrels
     */
    _moveBarrels() {
        BarrelService.moveBarrels(this.props.barrels, this.state.teamId)
        .then(_ => {

            // Prepare to move bottles
            let promises = [];
            for (let teamId in this.props.bottles) {
                for (let typeId in this.props.bottles[teamId]) {
                    promises.push(BottleActionService.create({
                            teamId: this.state.teamId,
                            fromTeamId: teamId && teamId != 'null' ? teamId : null,
                            typeId: typeId && typeId != 'null' ? typeId : null,
                            quantity: this.props.bottles[teamId][typeId],
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
                                this.props.barrels.map((barrel, i) => {
                                    return <BarrelChip
                                                key={i}
                                                barrel={barrel}
                                                team={this.props.teams.get(barrel.teamId)}
                                                type={this.props.barrelTypes.get(barrel.typeId)}
                                            />
                                })
                            }
                            {
                                Object.keys(this.props.bottles).map(teamId => {
                                    let team = this.props.teams.get(teamId);
                                    return Object.keys(this.props.bottles[teamId]).map(typeId => {
                                        let type = this.props.bottleTypes.get(typeId);
                                        return  <BottleChip
                                            key={(teamId + typeId)}
                                            count={this.props.bottles[teamId][typeId]}
                                            state="new"
                                            type={type}
                                            team={team}
                                        />
                                    })
                                })
                            }
                        </div>

                        <LocationSelect
                            teams={this.props.teams.findByPermission('ui/stockReceiver').sortBy('name')}
                            value={this.state.teamId}
                            setValue={(e, i, v) => this.setState({ teamId: v })}
                            floatingLabel="Destination"
                        />
                    </Dialog>
                }
            </div>
        );
    }

}
