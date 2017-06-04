import React from 'react';
import router from 'router';

import AlertService from 'services/AlertService';
import UserStore from 'stores/UserStore';
import NotificationActions from 'actions/NotificationActions';
import * as constants from 'config/constants';

import { Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';
import UpdateAlertPopover from 'components/log/UpdateAlertPopover.jsx';
import Assignment from 'material-ui/svg-icons/action/assignment-ind';
import Close from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import AccountCircleIcon from 'material-ui/svg-icons/action/account-circle';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import Avatar from 'material-ui/Avatar';

require('styles/log/Alert.scss');

/**
 * @param {Alert} alert
 * @param {ModelCollection} users
 * @param {ModelCollection} teams
 */
export default class Alert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateAlertPopover: false,
            popoverAnchor: null,
        };

        // binding
        this._toggleUpdateAlertPopover = this._toggleUpdateAlertPopover.bind(this);
        this._closeAlert = this._closeAlert.bind(this);
        this._restoreAlert = this._restoreAlert.bind(this);
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
        AlertService.update(this.props.alert.id, {severity: "done"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    /**
     * Call the service method to restore this alert
     */
    _restoreAlert() {
        AlertService.update(this.props.alert.id, {severity: "serious"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    render() {
        let date = new Date(this.props.alert.createdAt);
        date = date.getHours() + ':' + (date.getMinutes() < 10 ? '0':'') + date.getMinutes();

        let senderTeam = this.props.teams.get(this.props.alert.senderTeamId);
        return (
            <Col xs={12} sm={6} className="alert">
                <div className="alert__container">
                    <button
                        data-tip
                        data-for={"team-" + this.props.alert.id}
                        className={ 'alert__team-name__container alert__team-name__container--' + this.props.alert.severity}
                        onClick={() => (this.props.alert.sender && router.navigate('barhome.id', {id: this.props.alert.sender.id}))}>
                        <div className="alert__team-name">
                            {senderTeam.name || '-'}
                        </div>
                    </button>
                    <ReactTooltip
                        id={"team-" + this.props.alert.id}
                        place="bottom"
                    >
                        <span>
                            {senderTeam.name || 'Alerte automatique'}<br/>
                            {senderTeam.location}
                        </span>
                    </ReactTooltip>

                    <div className="alert__separator"><div></div>
                    </div>
                    <div className="alert__content"
                        data-tip
                        data-for={"content-" + this.props.alert.id}
                    >
                        <div>
                            <span
                                className="alert__title"
                            >
                                <p>
                                    {this.props.alert.title}
                                </p>
                            </span>
                            {this.props.alert.message &&
                                <div>
                                    <span className="alert__description">
                                        <p>
                                            {this.props.alert.message}
                                        </p>
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                    <ReactTooltip
                        id={"content-" + this.props.alert.id}
                        place="bottom"
                    >
                        <strong>{this.props.alert.title}</strong> - {date}<br/>
                        {this.props.alert.message}
                    </ReactTooltip>



                    <button className="alert__action--icon" onClick={this._toggleUpdateAlertPopover}>
                        {(Array.isArray(this.props.alert.users) && this.props.alert.users.length > 0) ?
                            <div>
                                <div
                                    className="alert__action--icon__avatars"
                                    data-tip
                                    data-for={"avatar-" + this.props.alert.id}
                                >
                                    { this.props.alert.users.map((id, i) => {
                                        return <div key={i}><Avatar src={(constants.avatarBasePath + id)} backgroundColor="#00AFCA" /></div>
                                    })}
                                </div>
                                <div style={{whiteSpace: 'pre-line'}}>
                                    <ReactTooltip
                                        id={"avatar-" + this.props.alert.id}
                                        place="bottom"
                                    >
                                        <span style={{whiteSpace: 'pre-line'}} className="bite">
                                            {this.props.alert.users.map((id, i) => {
                                                let user = this.props.users.get(id);
                                                if(user) {
                                                    return <span key={i}>{user.name}<br/></span>
                                                }
                                                return <span key={i}>Quelqu'un<br/></span>
                                            })}
                                        </span>
                                    </ReactTooltip>
                                </div>
                            </div>
                        :
                            <AccountCircleIcon />
                        }

                        { this.state.showUpdateAlertPopover &&
                            <UpdateAlertPopover
                                alert={this.props.alert}
                                onRequestClose={this._toggleUpdateAlertPopover}
                                open={this.state.showUpdateAlertPopover}
                                anchor={this.state.popoverAnchor}
                                users={this.props.users}
                            />
                        }
                    </button>

                    {this.props.alert.severity != 'done' ?
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
