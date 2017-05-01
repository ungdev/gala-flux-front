import React from 'react';

import AlertService from '../../services/AlertService';
import UserStore from '../../stores/UserStore';
import NotificationActions from '../../actions/NotificationActions';
import * as constants from '../../config/constants';

import { Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';
import UpdateAlertPopover from './UpdateAlertPopover.jsx';
import Assignment from 'material-ui/svg-icons/action/assignment-ind';
import Close from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import Avatar from 'material-ui/Avatar';

require('../../styles/log/Alert.scss');

export default class Alert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateAlertPopover: false,
            alert: props.alert,
            popoverAnchor: null,
        };

        // binding
        this._toggleUpdateAlertPopover = this._toggleUpdateAlertPopover.bind(this);
        this._closeAlert = this._closeAlert.bind(this);
        this._restoreAlert = this._restoreAlert.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            alert: props.alert
        });
    }

    /**
     * toggle the boolean to show the popover to assign users to this alert
     */
    _toggleUpdateAlertPopover(e) {
        let state = {
            showUpdateAlertPopover: !this.state.showUpdateAlertPopover,
        };
        if(e && e.currentTarget) {
            state['popoverAnchor'] = e.currentTarget;
        }
        this.setState(state);
    }

    /**
     * Call the service method to close this alert
     */
    _closeAlert() {
        AlertService.update(this.state.alert.id, {severity: "done"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    /**
     * Call the service method to restore this alert
     */
    _restoreAlert() {
        AlertService.update(this.state.alert.id, {severity: "serious"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    render() {

        return (
            <Col xs={12} sm={6} className="alert">
                <div className="alert__container">
                    <button
                        data-tip
                        data-for={"team-" + this.state.alert.id}
                        className={ 'alert__team-name__container alert__team-name__container--' + this.state.alert.severity}>
                        <div className="alert__team-name">
                            {this.props.alert.sender ? this.state.alert.sender.name : '-'}
                        </div>
                    </button>
                    <ReactTooltip
                        id={"team-" + this.state.alert.id}
                        place="bottom"
                    >
                        <span>{this.props.alert.sender ? this.props.alert.sender.name : 'Équipe supprimé ou alerte automatique'}</span>
                    </ReactTooltip>

                    <div className="alert__separator"><div></div>
                    </div>
                    <div className="alert__content">
                        <div>
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
                            {this.state.alert.message &&
                                <div>
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
                            }
                        </div>
                    </div>



                    <button className="alert__action--icon" onClick={this._toggleUpdateAlertPopover}>
                        {(Array.isArray(this.state.alert.users) && this.state.alert.users.length > 0) ?
                            <div>
                                <div
                                    className="alert__action--icon__avatars"
                                    data-tip
                                    data-for={"avatar-" + this.state.alert.id}
                                >
                                    { this.state.alert.users.map((id, i) => {
                                        return <div key={i}><Avatar src={(constants.avatarBasePath + id)} backgroundColor="#00AFCA" /></div>
                                    })}
                                </div>
                                <ReactTooltip
                                    id={"avatar-" + this.state.alert.id}
                                    place="bottom"
                                >
                                    <span>
                                        {this.state.alert.users.map((id, i) => {
                                            let user = UserStore.findById(id);
                                            if(user) {
                                                return <span key={i}>{user.name}<br/></span>
                                            }
                                            return <span key={i}>Quelqu'un<br/></span>
                                        })}
                                    </span>
                                </ReactTooltip>
                            </div>
                        :
                            <AccountCircleIcon />
                        }
                        <UpdateAlertPopover
                            alert={this.state.alert}
                            onRequestClose={this._toggleUpdateAlertPopover}
                            open={this.state.showUpdateAlertPopover}
                            anchor={this.state.popoverAnchor}
                        />
                    </button>

                    {this.state.alert.severity != 'done' ?
                        <button className="alert__action--primary" onClick={this._closeAlert}>
                            <CheckIcon />
                        </button>
                        :
                        <button className="alert__action--primary" onClick={this._restoreAlert}>
                            <UndoIcon />
                        </button>
                    }
                </div>
            </Col>
        );
    }
}
