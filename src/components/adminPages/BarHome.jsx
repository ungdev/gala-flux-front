import React from 'react';

import ChatMessageList from 'components/chat/ChatMessageList.jsx';
import ChatMessageForm from 'components/chat/ChatMessageForm.jsx';
import BarBarrels from 'components/barrels/BarBarrels.jsx';
import BarAlertButtons from 'components/alertButtons/BarAlertButtons.jsx';
import BarNav from 'components/bars/BarNav.jsx';
import DataLoader from 'components/partials/DataLoader.jsx';

export default class BarHome extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Team', {id: parseInt(this.props.barId)}],
                ])}
                onChange={ datastore => this.setState({
                    team: datastore.Team.first,
                })}
            >
                { () => {
                    const channel = 'public:' + this.state.team.name;
                    return (
                        <div>
                            <div className="BarHomePage BarHomePage_admin">
                                <div className="BarHomePage__alerts">
                                    <BarAlertButtons team={this.state.team} />
                                </div>
                                <div className="BarHomePage__stock">
                                    <BarBarrels team={this.state.team} />
                                </div>
                                <div className="BarHomePage__chat">
                                    <ChatMessageList channel={channel} />
                                    <ChatMessageForm channel={channel} />
                                </div>
                                <div className="BarHomePage_nav">
                                    <BarNav team={this.state.team} />
                                </div>
                            </div>
                        </div>
                    );
                }}
            </DataLoader>
        );
    }

}
