import React from 'react';

import AlertService from '../../services/AlertService';
import NotificationActions from '../../actions/NotificationActions';

import { Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip'
import UpdateAlertDialog from './UpdateAlertDialog.jsx';
import Assignment from 'material-ui/svg-icons/action/assignment-ind';
import Close from 'material-ui/svg-icons/navigation/close';

require('../../styles/log/Alert.scss');

export default class Alert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateAlertDialog: false,
            alert: props.alert,
            filter: props.filter
        };

        // binding
        this._toggleUpdateAlertDialog = this._toggleUpdateAlertDialog.bind(this);
        this._closeAlert = this._closeAlert.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            filter: props.filter,
            alert: props.alert
        });
    }

    /**
     * toggle the boolean to show the Dialog to assign users to this alert
     */
    _toggleUpdateAlertDialog() {
        this.setState({
            showUpdateAlertDialog: !this.state.showUpdateAlertDialog
        });
    }

    /**
     * Call the service method to close this alert
     */
    _closeAlert() {
        AlertService.update(this.state.alert.id, {severity: "done"})
            .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    render() {
        return (
            <Col xs={12} sm={6} md={6} lg={6} className="alert">
                <div className="alert__container">
                    <div className="alert__team-name__container">
                        <div
                            data-tip
                            className="alert__team-name"
                            data-for={"team-" + this.state.alert.id}
                        >
                            {this.state.alert.sender.name}
                        </div>
                        <ReactTooltip
                            id={"team-" + this.state.alert.id}
                            place="bottom"
                        >
                            <span>{this.props.alert.sender.name}</span>
                        </ReactTooltip>
                    </div>
                    <div className="alert__content">
                        <span
                            className="alert__title"
                            data-tip
                            data-for={"title-" + this.state.alert.id}
                        >
                            <p>
                                {this.state.alert.title}
                            </p>
                        </span>
                        <ReactTooltip
                            id={"title-" + this.state.alert.id}
                            place="bottom"
                        >
                            <span>{this.state.alert.title}</span>
                        </ReactTooltip>
                        <span
                            className="alert__description"
                            data-tip
                            data-for={"message-" + this.state.alert.id}
                        >
                            <p>
                                {this.state.alert.message}
                            </p>
                        </span>
                        <ReactTooltip
                            id={"message-" + this.state.alert.id}
                            place="bottom"
                        >
                            <span>{this.state.alert.message}</span>
                        </ReactTooltip>
                    </div>
                    {
                        this.state.filter !== 3 &&
                        <button
                            className="alert__action"
                            onClick={this._closeAlert}
                        >
                            <Close />
                        </button>
                    }
                    {
                        this.state.filter !== 3 &&
                        <button
                            className="alert__action"
                            onClick={this._toggleUpdateAlertDialog}
                        >
                            <Assignment />
                        </button>
                    }
                </div>
            </Col>
        );
    }
}
