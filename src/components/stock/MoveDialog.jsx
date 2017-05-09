import React from 'react';

import NotificationActions from '../../actions/NotificationActions';
import BarrelService from '../../services/BarrelService';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import TeamStore from '../../stores/TeamStore';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import BarrelChip from '../barrels/partials/BarrelChip.jsx';
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

    /**
     * Call the service method to update the location of the selected barrels
     */
    _moveBarrels() {
        BarrelService.moveBarrels(this.state.barrels, this.state.team)
            .then(_ => {
                this.props.close(true);
                NotificationActions.snackbar("Les fûts ont bien été déplacés.");
            })
            .catch(error => NotificationActions.error("Erreur lors du déplacement des fûts.", error));
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
                        modal={false}
                        onRequestClose={this.props.close}
                        actions={actions}
                    >
                        <p>
                            Les fûts sélectionnés vont être déplacés. Choisissez la destination.
                        </p>
                        <LocationSelect
                            teams={this.state.teams}
                            value={this.state.team}
                            setValue={(e, i, v) => this.setState({ team: v })}
                            floatingLabel={true}
                        />
                        <div className="BarrelChipContainer">
                            {
                                this.state.barrels.map((barrel, i) => {
                                    return <BarrelChip
                                                style={styles.chip}
                                                key={i}
                                                barrel={barrel}
                                                team={TeamStore.findById(barrel.place)}
                                                type={BarrelTypeStore.findById(barrel.type)}
                                            />
                                })
                            }
                        </div>
                    </Dialog>
                }
            </div>
        );
    }

}
