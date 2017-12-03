import React from 'react';

import AlertButtonStore from 'stores/AlertButtonStore';
import AuthStore from 'stores/AuthStore';
import TeamStore from 'stores/TeamStore';
import NotificationActions from 'actions/NotificationActions';

import ContentAddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import ListSubheader from 'material-ui/List/ListSubheader';
import Divider from 'material-ui/Divider';
import List, { ListItemText, ListItem } from 'material-ui/List';
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
        this.toggleNewButtonDialog = this.toggleNewButtonDialog.bind(this);
        this.toggleUpdateButtonDialog = this.toggleUpdateButtonDialog.bind(this);
    }


    /**
     * Set the state properties to open/close the update dialog
     * @param {object|null} button : the button to update
     */
    toggleUpdateButtonDialog(button) {
        this.setState({
            selectedButton: button,
            showUpdateButtonDialog: !this.state.showUpdateButtonDialog
        });
    }

    /**
     * toggle the dialog to create a new AlertButton
     */
    toggleNewButtonDialog() {
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
                        teams: datastore.Team.findByPermission('ui/alertReceiver'),
                        buttons: datastore.AlertButton.sortBy('title').groupBy('category'),
                    })}
                >
                    { () => (
                        <div className="FloatingButtonContainer">
                            {Object.keys(this.state.buttons).length > 0 ?
                                    <List>
                                        {Object.keys(this.state.buttons).map((category) => {
                                            return (
                                            <div key={category}>
                                                <ListSubheader disableSticky>{category}</ListSubheader>
                                                {this.state.buttons[category].map((button) => {
                                                    let team = this.state.teams.get(button.receiverTeamId);
                                                    team = team ? team.name : 'équipe supprimé';

                                                    return (
                                                        <ListItem
                                                            button
                                                            key={button.id}
                                                            onTouchTap={_ => this.toggleUpdateButtonDialog(button)}
                                                        >
                                                            <ListItemText primary={button.title} secondary={<span>{(button.senderGroup || '')} → {team}</span>} />
                                                        </ListItem>);
                                                })}
                                                <Divider/>
                                            </div>);
                                        })}
                                    </List>
                            :
                                <CenteredMessage>Il n'y a pas encore de boutons</CenteredMessage>
                            }

                            { AuthStore.can('alertButton/admin') &&
                                <Button
                                    fab
                                    color="primary"
                                    className="FloatingButton"
                                    onTouchTap={this.toggleNewButtonDialog}
                                >
                                    <ContentAddIcon />
                                </Button>
                            }

                            <NewButtonDialog
                                show={this.state.showNewButtonDialog}
                                close={this.toggleNewButtonDialog}
                                teams={this.state.teams}
                                categories={Object.keys(this.state.buttons)}
                            />

                            { this.state.selectedButton &&
                                <UpdateButtonDialog
                                    show={this.state.showUpdateButtonDialog}
                                    close={this.toggleUpdateButtonDialog}
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
