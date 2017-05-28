import React from 'react';

import AlertButtonStore from 'stores/AlertButtonStore';
import AuthStore from 'stores/AuthStore';
import TeamStore from 'stores/TeamStore';
import NotificationActions from 'actions/NotificationActions';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import CenteredMessage from 'components/partials/CenteredMessage.jsx'

import NewButtonDialog from 'components/alertButtons/NewButtonDialog.jsx';
import UpdateButtonDialog from 'components/alertButtons/UpdateButtonDialog.jsx';

export default class ButtonList extends React.Component {

    constructor() {
        super();

        this.state = {
            buttons: {},
            receiverTeams: [],
            counts: {},
            showUpdateButtonDialog: false,
            showNewButtonDialog: false,
            selectedButton: null,
        };

        this.AlertButtonStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._toggleNewButtonDialog = this._toggleNewButtonDialog.bind(this);
        this._toggleUpdateButtonDialog = this._toggleUpdateButtonDialog.bind(this);
        this._loadData = this._loadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentDidMount() {
        // Load data from store
        this._loadData();

        // listen the stores changes
        AlertButtonStore.addChangeListener(this._updateData);
        TeamStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear store
        TeamStore.unloadData(this.TeamStoreToken);
        AlertButtonStore.unloadData(this.AlertButtonStoreToken);

        // remove the stores listeners
        AlertButtonStore.removeChangeListener(this._updateData);
        TeamStore.removeChangeListener(this._updateData);
    }


    /**
     * Load data from all stores and update state
     */
    _loadData() {
        // Load data from store
        AlertButtonStore.loadData(null)
        .then(data => {
            // ensure that last token doen't exist anymore.
            AlertButtonStore.unloadData(this.AlertButtonStoreToken);

            // save the component token
            this.AlertButtonStoreToken = data.token;

            // Load Barrel counts per types
            return TeamStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doen't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);

            // save the component token
            this.TeamStoreToken = data.token;

            // Save the new state value
            this._updateData();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des boutons d\'alerte', error);
        });
    }



    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        const buttonsRaw = AlertButtonStore.buttons;
        let buttons = {};

        // get distinct categories
        for (let button of buttonsRaw) {
            if (!Array.isArray(buttons[button.category])) {
                buttons[button.category] = [];
            }
            buttons[button.category].push(button);
        }

        this.setState({
            receiverTeams: TeamStore.findByPermission('ui/receiveAlerts'),
            buttons,
        });
    }

    /**
     * Set the state properties to open/close the update dialog
     * @param {object|null} button : the button to update
     */
    _toggleUpdateButtonDialog(button) {
        this.setState({
            selectedButton: button,
            showUpdateButtonDialog: !this.state.showUpdateButtonDialog
        });
    }

    /**
     * toggle the dialog to create a new AlertButton
     */
    _toggleNewButtonDialog() {
        this.setState({ showNewButtonDialog: !this.state.showNewButtonDialog })
    }


    render() {
        return (
            <div className="FloatingButtonContainer">
                {this.state.buttons && Object.keys(this.state.buttons).length > 0 ?
                        <List>
                            {Object.keys(this.state.buttons).sort((a,b) => {return a.localeCompare(b)}).map((category, i) => {
                                return <div key={i}>
                                    <Subheader>{category}</Subheader>
                                    {this.state.buttons[category].map((button, i) => {
                                        let team = TeamStore.findById(button.receiverTeamId);
                                        team = team ? team.name : 'équipe supprimé';

                                        return  <ListItem
                                                primaryText={button.title}
                                                secondaryText={<span>{(button.senderGroup || '')} → {team}</span>}
                                                key={button.id}
                                                onTouchTap={_ => this._toggleUpdateButtonDialog(button)}
                                            />
                                    })}
                                    <Divider/>
                                </div>
                            })}
                        </List>
                :
                    <CenteredMessage>Il n'y a pas encore de boutons</CenteredMessage>
                }

                { AuthStore.can('alertButton/admin') &&
                    <FloatingActionButton
                        className="FloatingButton"
                        onTouchTap={this._toggleNewButtonDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>
                }

                <NewButtonDialog
                    show={this.state.showNewButtonDialog}
                    close={this._toggleNewButtonDialog}
                    teams={this.state.receiverTeams}
                    categories={Object.keys(this.state.buttons)}
                />

                <UpdateButtonDialog
                    show={this.state.showUpdateButtonDialog}
                    close={this._toggleUpdateButtonDialog}
                    button={this.state.selectedButton}
                    teams={this.state.receiverTeams}
                    categories={Object.keys(this.state.buttons)}
                />
            </div>
        );
    }
}
