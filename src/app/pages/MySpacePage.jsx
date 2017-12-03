import React from 'react';

import AuthStore from 'stores/AuthStore';

import Page from 'app/components/Page.jsx';
import PagePart from 'app/components/PagePart.jsx';
import TeamStockScene from 'app/Stocks/TeamStockScene.jsx';
import ChatScene from 'app/Chat/ChatScene.jsx';
import AlertButtonScene from 'app/AlertButtons/AlertButtonScene.jsx';

class MySpacePage extends React.Component {
    render() {
        return (
            <Page>
                <PagePart main={this.props.router.isActive('/myalerts') || this.props.router.isActive('/myspace')} breakpoint="xs">
                    <AlertButtonScene team={AuthStore.team} />
                </PagePart>
                <PagePart main={this.props.router.isActive('/mystock')} breakpoint="xs">
                    <TeamStockScene team={AuthStore.team} />
                </PagePart>
                <PagePart main={false}>
                    <ChatScene hideMenu/>
                </PagePart>
            </Page>
        );
    }
}
export default MySpacePage;
