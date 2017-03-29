import React from 'react';

import { List, ListItem, makeSelectable } from 'material-ui/List';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NewTeam from './NewTeam.jsx';

let SelectableList = makeSelectable(List);

export default class TeamList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams,
            selectedId: (props.selected.team ? props.selected.team.id : null),
            showCreateDialog: false,
        };

        // binding
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ teams: nextProps.teams, selectedId: (nextProps.selected.team ? nextProps.selected.team.id : null) });
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
            <div className="hideContainer">
                <div style={style.container}>
                    <SelectableList value={this.state.selectedId}>
                        {
                            // For each message, create a Message component
                            this.state.teams.map((team, i) => {
                                return (
                                    <ListItem
                                        value={team.id}
                                        key={team.id}
                                        primaryText={team.name}
                                        secondaryText={team.role}
                                        onTouchTap={_ => this.props.showTeam(team)}
                                    />
                                );
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
