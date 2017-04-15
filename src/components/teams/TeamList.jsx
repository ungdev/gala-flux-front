import React from 'react';

import TeamStore from '../../stores/TeamStore';
import NotificationActions from '../../actions/NotificationActions'

import SelectableList from '../partials/SelectableList.jsx'
import { List, ListItem, makeSelectable } from 'material-ui/List';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NewTeam from './NewTeam.jsx';


/**
 * This component will show a clickable list of teams
 * @param {string} selectedId id of the selected team
 * @param {function(Team)} onTeamSelection event emitted when a team is selected
 */
export default class TeamList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            selectedId: props.selectedId,
            showCreateDialog: false,
        };

        // binding
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
        this._loadData = this._loadData.bind(this);
        this._unloadData = this._unloadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedId: nextProps.selectedId
        });
    }

    componentDidMount() {
        // Load data from store
        this._loadData();

        // listen the stores changes
        TeamStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear store
        this._unloadData();

        // remove the stores listeners
        TeamStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     */
    _loadData() {
        let newState = {};
        // Load team in store
        TeamStore.loadData(null)
        .then(data => {
            // ensure that last token doen't exist anymore.
            TeamStore.unloadData(this.TeamStoreToken);

            // save the component token
            this.TeamStoreToken = data.token;

            // Save the new state value
            newState.teams = data.result;
            this.setState(newState);
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des équipes', error);
        });
    }

    /**
     * clear stores
     */
    _unloadData() {
        TeamStore.unloadData(this.TeamStoreToken);
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        this.setState({
            teams: TeamStore.find(),
        });
    }

    /**
     * Show or hide the create dialog
     */
    _toggleCreateDialog() {
        this.setState({showCreateDialog: !this.state.showCreateDialog});
    }

    render() {
        const style = {
            container: {
                position: 'relative',
                height: '100%',
                overflow: 'auto',
            },
            floatingButton: {
                position: 'absolute',
                right: '36px',
                bottom: '36px',
            },
        };

        return (
            <div className="container-hide">
                <div style={style.container}>
                    <SelectableList value={this.state.selectedId}>
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
                </div>

                <FloatingActionButton
                    style={style.floatingButton}
                    secondary={true}
                    onTouchTap={this._toggleCreateDialog}
                >
                    <ContentAddIcon />
                </FloatingActionButton>

                <NewTeam
                    show={this.state.showCreateDialog}
                    close={this._toggleCreateDialog}
                />
            </div>
        );
    }

}
