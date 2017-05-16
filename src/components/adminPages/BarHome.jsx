import React from 'react';

import ChatMessageList from 'components/chat/ChatMessageList.jsx';
import ChatMessageForm from 'components/chat/ChatMessageForm.jsx';
import BarBarrels from 'components/barrels/BarBarrels.jsx';
import BarAlertButtons  from 'components/alertButtons/BarAlertButtons.jsx';

export default class BarHome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barId: props.barId
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barId: nextProps.barId,
        });
    }

    render() {
        return (
            <div>
                <div className="BarHomePage BarHomePage_admin">
                    <div className="BarHomePage__alerts">
                        <BarAlertButtons barId={this.state.barId} />
                    </div>
                    <div className="BarHomePage__stock">
                        <BarBarrels />
                    </div>
                    <div className="BarHomePage__chat">
                        <ChatMessageList channel={null}/>
                        <ChatMessageForm channel={null}/>
                    </div>
                    <div className="BarHomePage_nav">
                        test
                    </div>
                </div>
            </div>
        );
    }

}