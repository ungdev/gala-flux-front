import React from 'react';

import ChatScene from 'app/Chat/ChatScene.jsx';
import AlertScene from 'app/Alerts/AlertScene.jsx';
import Page from 'app/components/Page.jsx';
import PagePart from 'app/components/PagePart.jsx';
import PagePartSeparator from 'app/components/PagePartSeparator.jsx';

/**
 * @param {Object} router react-router router object
 */
export default class DashboardPage extends React.Component {
    render() {
        return (
            <Page>
                <PagePart main={this.props.router.isActive('/alerts')}>
                    <AlertScene />
                </PagePart>
                <PagePartSeparator main={false}/>
                <PagePart main={!this.props.router.isActive('/alerts')}>
                    <ChatScene router={this.props.router} />
                </PagePart>
            </Page>
        );
    }
}
