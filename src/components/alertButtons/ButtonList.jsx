import React from 'react';

import AlertButtonStore from '../../stores/AlertButtonStore';
import TeamStore from '../../stores/TeamStore';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import NewButton from './NewButton.jsx';
import UpdateButton from './UpdateButton.jsx';
import AdminButton from './AdminButton.jsx';

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

    _onTeamStoreChange() {
        this.setState({ teams: TeamStore.teams });
    }

    _toggleUpdateDialog(button) {
        this.setState({
            selectedButton: button,
            showUpdateDialog: !this.state.showUpdateDialog
        });
    }

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

    _toggleCreateDialog() {
        this.setState({ showCreateDialog: !this.state.showCreateDialog })
    }

    render() {

        const style = {
            floatingButton: {
                position: 'absolute',
                right: 36,
                bottom: 36,
            }
        };

        return (
            <div>
                <SelectField
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
                {
                    // show only the buttons where the category his the selected category
                    this.state.buttons.map((button, i) => {
                        if (button.category === this.state.selectedCategory) {
                            return  <AdminButton
                                key={i}
                                button={button}
                                update={this._toggleUpdateDialog}
                            />
                        }
                    })
                }

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