import React from 'react';

import TeamStore from '../../stores/TeamStore';

import ChatMessageList from 'components/chat/ChatMessageList.jsx';
import ChatMessageForm from 'components/chat/ChatMessageForm.jsx';
import BarBarrels from 'components/barrels/BarBarrels.jsx';
import BarStats from 'components/buckless/BarStats.jsx';
import BarAlertButtons from 'components/alertButtons/BarAlertButtons.jsx';
import BarNav from 'components/bars/BarNav.jsx';

export default class BarHome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barId: props.barId,
            team: null
        };

        this.TeamStoreToken = null;

        // binding
        this._loadTeam = this._loadTeam.bind(this);
    }

    componentDidMount() {
        this._loadTeam(this.state.barId);
    }

    componentWillReceiveProps(nextProps) {
        this._loadTeam(nextProps.barId);
    }

    _loadTeam(barId) {
        TeamStore.loadData({id: barId})
            .then(data => {
                // ensure that last token doen't exist anymore.
                TeamStore.unloadData(this.TeamStoreToken);

                // save the component token
                this.TeamStoreToken = data.token;

                // update state
                this.setState({
                    barId,
                    team: TeamStore.findById(barId)
                });
            })
            .catch(error => {
                NotificationActions.error("Une erreur s'est produite pendant le chargement de l'équipe.", error);
            });
    }

    render() {
        const channel = this.state.team ? 'public:' + this.state.team.name : null;

        return (
            <div>
                <div className="BarHomePage BarHomePage_admin">
                    <div className="BarHomePage__alerts">
                        <BarAlertButtons barId={this.state.barId} />
                    </div>
                    <div className="BarHomePage__stock">
                        <BarBarrels barId={this.state.barId} />
                        {this.state.team && <BarStats team={this.state.team} />}
                    </div>
                    <div className="BarHomePage__chat">
                        <ChatMessageList channel={channel} />
                        <ChatMessageForm channel={channel} />
                    </div>
                    <div className="BarHomePage_nav">
                        <BarNav barId={this.state.barId} />
                    </div>
                </div>
            </div>
        );
    }

}