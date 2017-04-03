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

        // binding
        this._onAlertButtonStoreChange = this._onAlertButtonStoreChange.bind(this);
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
    }

    componentDidMount() {
        // listen stores changes
        AlertButtonStore.addChangeListener(this._onAlertButtonStoreChange);
        TeamStore.addChangeListener(this._onTeamStoreChange);
        // init team list
        this.setState({ teams: TeamStore.teams });
    }

    componentWillUnmount() {
        // remove the stores listeners
        AlertButtonStore.removeChangeListener(this._onAlertButtonStoreChange);
        TeamStore.removeChangeListener(this._onTeamStoreChange);
    }

    /**
     * Update the teams in the component store where there is a change in the TeamStore
     */
    _onTeamStoreChange() {
        this.setState({ teams: TeamStore.teams });
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
    _onAlertButtonStoreChange() {
        const buttons = AlertButtonStore.buttons;

        let categories = [];
        // get distinct categories
        for (let button of buttons) {
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
                    // if no category is selected, show all the buttons
                    // else show only the buttons where the category his the selected category
                    this.state.buttons.map((button, i) => {
                        if (!this.state.selectedCategory || button.category === this.state.selectedCategory) {
                            return <ListItem
                                key={i}
                                primaryText={button.title}
                                rightIcon={<Edit />}
                                onClick={this._toggleUpdateDialog}
                            />
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