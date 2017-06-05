import React from 'react';

import AuthStore from 'stores/AuthStore';

import TeamStockScene from 'app/Stocks/TeamStockScene.jsx';
import ChatScene from 'app/Chat/ChatScene.jsx';
import AlertButtonScene from 'app/AlertButtons/AlertButtonScene.jsx';

require('./TeamSpace.scss');

export default class MyspacePage extends React.Component {
    render() {
        return (
            AuthStore.team &&
                <div className="TeamSpace">
                    <div className={('TeamSpace__alerts ' +  (!this.props.router.isActive('/mystock') ? 'TeamSpace__col--secondary' : ''))}>
                        <AlertButtonScene team={AuthStore.team} />
                    </div>
                    <div className={('TeamSpace__stock ' + (this.props.router.isActive('/mystock') ? 'TeamSpace__col--secondary' : ''))}>
                        <TeamStockScene team={AuthStore.team} />
                    </div>
                    <div className="TeamSpace__chat">
                        <ChatScene />
                    </div>
                </div>

        );
    }
}
