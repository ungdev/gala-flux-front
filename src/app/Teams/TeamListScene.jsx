import React from 'react';

import TeamStore from 'stores/TeamStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions';

import MenuContainer from 'app/Layout/components/MenuContainer.jsx';
import SelectableListItem from 'app/components/SelectableListItem.jsx';
import { ListItemText, ListItem } from 'material-ui/List';
import ContentAddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import NewTeamDialog from 'app/Teams/dialogs/NewTeamDialog.jsx';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * This component will show a clickable list of teams
 * @param {Object} router React router object
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
                            <MenuContainer router={this.props.router}>
                                {
                                    this.state.teams.map((team, i) => {
                                        return <SelectableListItem
                                                    value={'/admin/team/'+team.id}
                                                    key={team.id}
                                                >
                                                    <ListItemText primary={team.name} secondary={team.role} />
                                                </SelectableListItem>
                                    })
                                }
                            </MenuContainer>
                        )
                    }
                </DataLoader>

                { AuthStore.can('team/admin') &&
                    <Button
                        color="primary"
                        fab
                        className="FloatingButton"
                        onTouchTap={this._toggleCreateDialog}
                    >
                        <ContentAddIcon />
                    </Button>
                }

                <NewTeamDialog
                    show={this.state.showCreateDialog}
                    close={this._toggleCreateDialog}
                />
            </div>
        );
    }

}
