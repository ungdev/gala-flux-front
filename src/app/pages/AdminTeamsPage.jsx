import React from 'react';

import TeamListScene from 'app/Teams/TeamListScene.jsx';
import TeamDetailsScene from 'app/Teams/TeamDetailsScene.jsx';
import Page from 'app/components/Page.jsx';
import PagePart from 'app/components/PagePart.jsx';
import PagePartSeparator from 'app/components/PagePartSeparator.jsx';

export default class AdminTeamsPage extends React.Component {
    render() {
        return (
            <Page>
                <PagePart main={this.props.router.getCurrentLocation().pathname == '/admin/teams'}>
                    <TeamListScene
                        router={this.props.router}
                    />
                </PagePart>
                <PagePartSeparator main={false}/>
                <PagePart main={this.props.router.getCurrentLocation().pathname != '/admin/teams'}>
                    <TeamDetailsScene
                        id={this.props.router.params.id}
                    />
                </PagePart>
            </Page>
        );
    }
}
