import React from 'react';

import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import SelectableList from 'components/partials/SelectableList.jsx';
import { ListItem } from 'material-ui/List';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NewTeamDialog from 'components/teams/dialogs/NewTeamDialog.jsx';
import DataLoader from "components/partials/DataLoader.jsx";


/**
 * This component will show a clickable list of teams
 * @param {string} selectedId id of the selected team
 * @param {function(Team)} onTeamSelection event emitted when a team is selected
 */
export default class TeamList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedId: props.selectedId,
            showCreateDialog: false,
            datastore: null,
        };

        // binding
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedId: nextProps.selectedId
        });
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
                    onChange={ datastore => this.setState({datastore}) }
                >{ () => {
                    const teams = [...this.state.datastore.Team.values()];

                    return (
                        <SelectableList value={this.state.selectedId}>
                            {
                                teams.map((team, i) => {
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
                }}</DataLoader>

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
