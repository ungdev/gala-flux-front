import React from 'react';

import TeamListScene from 'app/Teams/TeamListScene.jsx';
import TeamDetailsScene from 'app/Teams/TeamDetailsScene.jsx';

require('./pages.scss');

export default class AdminTeamsPage extends React.Component {
    render() {
        return (
            <div className="pages__VerticalSplitLayout">
                <div className={!this.props.router.isActive('/admin/team/:id') && 'pages__VerticalSplitLayout__secondary'}>
                    <TeamListScene
                        selectedId={this.props.router.params.id}
                        onTeamSelection={team => this.props.router.push('/admin/team/' + team.id)}
                    />
                </div>
                <div className={this.props.router.isActive('/admin/team/:id') && 'pages__VerticalSplitLayout__secondary'}>
                    <TeamDetailsScene
                        id={this.props.router.params.id}
                    />
                </div>
            </div>
        );
    }
}
