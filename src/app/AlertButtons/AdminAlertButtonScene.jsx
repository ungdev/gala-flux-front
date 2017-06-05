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
import CenteredMessage from 'app/components/CenteredMessage.jsx'
import DataLoader from "app/components/DataLoader.jsx";

import NewButtonDialog from 'app/AlertButtons/dialogs/NewButtonDialog.jsx';
import UpdateButtonDialog from 'app/AlertButtons/dialogs/UpdateButtonDialog.jsx';

export default class AdminAlertButtonScene extends React.Component {

    constructor() {
        super();

        this.state = {
            teams: null,
            buttons: null,
            showUpdateButtonDialog: false,
            showNewButtonDialog: false,
            selectedButton: null,
        };

        this.AlertButtonStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._toggleNewButtonDialog = this._toggleNewButtonDialog.bind(this);
        this._toggleUpdateButtonDialog = this._toggleUpdateButtonDialog.bind(this);
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
                <DataLoader
                    filters={new Map([
                        ['Team', null],
                        ['AlertButton', null],
                    ])}
                    onChange={ datastore => this.setState({
                        teams: datastore.Team.findByPermission('ui/receiveAlerts'),
                        buttons: datastore.AlertButton.sortBy('title').groupBy('category'),
                    })}
                >
                    { () => (
                        <div className="FloatingButtonContainer">
                            {Object.keys(this.state.buttons).length > 0 ?
                                    <List>
                                        {Object.keys(this.state.buttons).map((category, i) => {
                                            return <div key={i}>
                                                <Subheader>{category}</Subheader>
                                                {this.state.buttons[category].map((button, i) => {
                                                    let team = this.state.teams.get(button.receiverTeamId);
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
                                teams={this.state.teams}
                                categories={Object.keys(this.state.buttons)}
                            />

                            { this.state.selectedButton &&
                                <UpdateButtonDialog
                                    show={this.state.showUpdateButtonDialog}
                                    close={this._toggleUpdateButtonDialog}
                                    button={this.state.selectedButton}
                                    teams={this.state.teams}
                                    categories={Object.keys(this.state.buttons)}
                                />
                            }
                        </div>
                    )}
                </DataLoader>
            </div>
        );
    }
}
