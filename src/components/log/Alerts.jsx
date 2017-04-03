import React from 'react';
import * as c from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
require('../../styles/log/Alerts.scss');

export default class Alerts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedButton: 1
        };

        // binding
        this._toggleUpdateDialog = this._toggleUpdateDialog.bind(this);
        this._toggleMemberDialog = this._toggleMemberDialog.bind(this);
    }

    render() {
        return (
            <div className="alerts">
                <div className="alert__header">Alertes</div>
                <div className="alerts__buttons">
                    <RaisedButton id="1" label="En attente" />
                    <RaisedButton id="2" label="En cours de traitement" />
                    <RaisedButton id="3" label="Terminées" />
                </div>
            </div>
        );
    }
}
