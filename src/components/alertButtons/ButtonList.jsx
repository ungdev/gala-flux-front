import React from 'react';

import AlertButtonStore from '../../stores/AlertButtonStore';
import TeamStore from '../../stores/TeamStore';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List';
import Edit from 'material-ui/svg-icons/image/edit';

import NewButton from './NewButton.jsx';
import UpdateButton from './UpdateButton.jsx';

export default class ButtonList extends React.Component {

    constructor() {
        super();

        this.state = {
            buttons: [],
            teams: [],
            categories: [],
            selectedCategory: null,
            selectedButton: null,
            showCreateDialog: false,
            showUpdateDialog: false
        };

        this.AlertButtonStoreToken = null;
        this.TeamStoreToken = null;

        // binding
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._setTeams = this._setTeams.bind(this);
        this._setButtons = this._setButtons.bind(this);
    }

    componentDidMount() {
        // fill stores
        AlertButtonStore.loadData(null)
            .then(data => {
                // save the component token
                this.AlertButtonStoreToken = data.token;
            })
            .catch(error => console.log("load alert buttons error", error));
        TeamStore.loadData(null)
            .then(data => {
                // save the component token
                this.TeamStoreToken = data.token;
            })
            .catch(error => console.log("load teams error", error));
        // listen stores changes
        AlertButtonStore.addChangeListener(this._setButtons);
        TeamStore.addChangeListener(this._setTeams);
        // init component state
        this._setTeams();
        this._setButtons();
    }

    componentWillUnmount() {
        // clear the stores
        AlertButtonStore.unloadData(this.AlertButtonStoreToken);
        TeamStore.unloadData(this.TeamStoreToken);
        // remove the stores listeners
        AlertButtonStore.removeChangeListener(this._setButtons);
        TeamStore.removeChangeListener(this._setTeams);
    }

    /**
     * Update the teams in the component store where there is a change in the TeamStore
     */
    _setTeams() {
        const storeTeams = TeamStore.teams;

        let teams = [];
        for (let i in storeTeams) {
            teams.push(storeTeams[i]);
        }

        this.setState({ teams });
    }

    /**
     * Set the state properties to open/close the update dialog
     * @param {object|null} button : the button to update
     */
    _toggleUpdateDialog(button) {
        this.setState({
            selectedButton: button,
            showUpdateDialog: !this.state.showUpdateDialog
        });
    }

    /**
     * Handle AlertButtonStore changes
     * update the buttons and categories in the state
     */
    _setButtons() {
        const storeAlertButton = AlertButtonStore.buttons;
        let categories = [];
        let buttons = [];

        // get distinct categories
        for (let i in storeAlertButton) {
            let button = storeAlertButton[i];
            buttons.push(button);
            if (categories.indexOf(button.category) === -1) {
                categories.push(button.category);
            }
        }

        this.setState({ buttons, categories });
    }

    /**
     * toggle the dialog to create a new AlertButton
     */
    _toggleCreateDialog() {
        this.setState({ showCreateDialog: !this.state.showCreateDialog })
    }

    render() {

        const style = {
            container: {
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 10
            },
            floatingButton: {
                position: 'fixed',
                right: 36,
                bottom: 36,
            }
        };

        return (
            <div style={style.container}>
                <SelectField
                    fullWidth={true}
                    floatingLabelText="Categorie"
                    value={this.state.selectedCategory}
                    onChange={(e, i, v) => this.setState({ selectedCategory: v })}
                >
                    {
                        this.state.categories.map((category, i) => {
                            return <MenuItem key={i} value={category} primaryText={category} />
                        })
                    }
                </SelectField>

                <List>
                    {
                        this.state.buttons.map(button => {
                            // if no category is selected, show all the buttons
                            // else show only the buttons where the category his the selected category
                            if (!this.state.selectedCategory || button.category === this.state.selectedCategory) {
                                return  <ListItem
                                            key={button.id}
                                            primaryText={button.title}
                                            rightIcon={<Edit />}
                                            onClick={_ => this._toggleUpdateDialog(button)}
                                        />;
                            }
                        })
                    }
                </List>

                <FloatingActionButton
                    style={style.floatingButton}
                    secondary={true}
                    onTouchTap={this._toggleCreateDialog}
                >
                    <ContentAddIcon />
                </FloatingActionButton>

                <NewButton
                    show={this.state.showCreateDialog}
                    close={this._toggleCreateDialog}
                    teams={this.state.teams}
                />

                <UpdateButton
                    show={this.state.showUpdateDialog}
                    close={this._toggleUpdateDialog}
                    button={this.state.selectedButton}
                    categories={this.state.categories}
                    teams={this.state.teams}
                />
            </div>
        );
    }

}