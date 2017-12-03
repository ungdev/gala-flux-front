import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import BarrelService from 'services/BarrelService';
import BottleActionService from 'services/BottleActionService';
import BottleTypeStore from 'stores/BottleTypeStore';
import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import TeamStore from 'stores/TeamStore';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import Button from 'material-ui/Button';
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
            teamId: ""
        };

        // binding
        this.moveBarrels = this.moveBarrels.bind(this);
    }

    /**
     * Call the service method to update the location of the selected barrels
     */
    moveBarrels() {
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
        return (
            <div>
                {
                    <Dialog
                        open={this.props.show}
                        onRequestClose={this.props.close}
                    >
                        <DialogTitle>Déplacement de fûts</DialogTitle>
                        <DialogContent>
                            <p>
                                Les fûts et bouteilles suivantes vont être déplacés.
                            </p>

                            <div className="BarrelChipContainer">
                                {
                                    this.props.barrels.map((barrel) => {
                                        return <BarrelChip
                                                    key={barrel.id}
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

                            <InputLabel htmlFor="destination-select">Destination</InputLabel>
                            <LocationSelect
                                input={<Input id="destination-select" />}
                                teams={this.props.teams.findByPermission('ui/stockReceiver').sortBy('name')}
                                value={this.state.teamId}
                                setValue={(v) => this.setState({ teamId: v })}
                                fullWidth
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="accent"
                                onClick={this.props.close}
                            >
                                Annuler
                            </Button>
                            <Button
                                color="primary"
                                onClick={this.moveBarrels}
                            >
                                Déplacer
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </div>
        );
    }

}
