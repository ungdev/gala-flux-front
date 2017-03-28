import React from 'react';

import TeamService from '../../services/TeamService';

import Button from 'material-ui/Button';

export default class UpdateTeamInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team
        };

        // binding
        this._deleteTeam = this._deleteTeam.bind(this);
    }

    _deleteTeam() {
        TeamService.deleteTeam(this.state.team.id, err => {
            if (err) {
                console.log("delete team err : ", err);
            }
            this.props.closeDialog();
        });
    }

    render() {
        return (
            <div>
                <Button raised accent onClick={this._deleteTeam}>
                    Delete team
                </Button>
            </div>
        );
    }

}