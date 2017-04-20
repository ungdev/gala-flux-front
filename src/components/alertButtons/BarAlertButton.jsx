import React from 'react';

import AlertButtonService from '../../services/AlertButtonService';

require('../../styles/bar/AlertButton.scss');

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert
        };

        // binding
        this._createAlert = this._createAlert.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            alert: nextProps.alert
        });
    }

    _createAlert() {
        AlertButtonService.createAlert(this.state.button.id)
            .catch(error => console.log("create alert button error", error));
    }

    render() {

        if (this.state.alert) {
            return (
                <div>
                    alert !
                </div>
            );
        }

        return (
            <div>
                <button className="AlertButton_button" onClick={this._createAlert}>
                    {this.state.button.title}
                </button>
            </div>
        );
    }

}