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
    }

    _toggleUpdateDialog(e) {
        this.setState({selectedButton: e});
    }

    render() {
        return (
            <div className="alerts">
                <div className="alert__header">Alertes</div>
                <div className="alerts__buttons">
                    <RaisedButton 
                        label="En attente"
                        onTouchTap={this._toggleUpdateDialog.bind(this, 1)}
                        backgroundColor={(this.state.selectedButton === 1 ? c.cyanA700 : '')}
                    />
                    <RaisedButton
                        label="En cours de traitement"
                        onTouchTap={this._toggleUpdateDialog.bind(this, 2)}
                        backgroundColor={(this.state.selectedButton === 2 ? c.cyanA700 : '')}
                    />
                    <RaisedButton
                        label="Terminées"
                        onTouchTap={this._toggleUpdateDialog.bind(this, 3)}
                        backgroundColor={(this.state.selectedButton === 3 ? c.cyanA700 : '')}
                    />
                </div>
            </div>
        );
    }
}
