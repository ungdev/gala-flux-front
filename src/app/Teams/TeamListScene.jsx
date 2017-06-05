import React from 'react';

import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import SelectableList from 'app/components/SelectableList.jsx';
import { ListItem } from 'material-ui/List';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NewTeamDialog from 'app/Teams/dialogs/NewTeamDialog.jsx';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * This component will show a clickable list of teams
 * @param {string} selectedId id of the selected team
 * @param {function(Team)} onTeamSelection event emitted when a team is selected
 */
export default class TeamListScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showCreateDialog: false,
            teams: null,
        };

        // binding
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
    }

    /**
     * Show or hide the create dialog
     */
    _toggleCreateDialog() {
        this.setState({showCreateDialog: !this.state.showCreateDialog});
    }

    render() {
        return (
            <div className="FloatingButtonContainer">
                <DataLoader
                    filters={new Map([
                        ['Team', null],
                    ])}
                    onChange={ datastore => this.setState({
                        teams: datastore.Team,
                    })}
                >
                    { () => (
                            <SelectableList value={parseInt(this.props.selectedId)}>
                                {
                                    this.state.teams.map((team, i) => {
                                        return <ListItem
                                                    value={team.id}
                                                    key={i}
                                                    primaryText={team.name}
                                                    secondaryText={team.role}
                                                    onTouchTap={_ => this.props.onTeamSelection(team)}
                                                />
                                    })
                                }
                            </SelectableList>
                        )
                    }
                </DataLoader>

                { AuthStore.can('team/admin') &&
                    <FloatingActionButton
                        className="FloatingButton"
                        onTouchTap={this._toggleCreateDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>
                }

                <NewTeamDialog
                    show={this.state.showCreateDialog}
                    close={this._toggleCreateDialog}
                />
            </div>
        );
    }

}
