import React from 'react';

import { List } from 'material-ui/List';
import TeamMember from './TeamMember.jsx';

export default class TeamDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    render() {
        if (this.state.selected.team) {
            return (
                <div>
                    <h2>{this.state.selected.team.name}</h2>
                    {
                        (this.state.selected.members && this.state.selected.members.length)
                            ?
                            <List>
                                {
                                    this.state.selected.members.map((member, i) => {
                                        return <TeamMember member={member} key={i}/>
                                    })
                                }
                            </List>
                            :
                            <span>No members</span>
                    }
                </div>
            );
        }
        return (
            <div>
                <span>Select a team to see the details.</span>
            </div>
        );
    }

}