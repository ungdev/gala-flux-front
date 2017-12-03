import React from 'react';
import { browserHistory } from 'react-router';

import AlertService from 'services/AlertService';
import UserStore from 'stores/UserStore';
import NotificationActions from 'actions/NotificationActions';
import * as constants from 'config/constants';

import { Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';
import UpdateAlertPopover from 'app/Alerts/components/UpdateAlertPopover.jsx';
import Assignment from 'material-ui-icons/AssignmentInd';
import Close from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import UndoIcon from 'material-ui-icons/Undo';
import CheckIcon from 'material-ui-icons/Check';
import Avatar from 'material-ui/Avatar';

require('./Alert.scss');

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
        this.showUpdateAlertPopover = this.showUpdateAlertPopover.bind(this);
        this.hideUpdateAlertPopover = this.hideUpdateAlertPopover.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.restoreAlert = this.restoreAlert.bind(this);
    }

    /**
     * toggle the boolean to show the popover to assign users to this alert
     */
    showUpdateAlertPopover(e) {
        let state = {
            showUpdateAlertPopover: true,
        };
        if(e && e.currentTarget) {
            state['popoverAnchor'] = e.currentTarget;
        }
        this.setState(state);
    }

    /**
     * toggle the boolean to show the popover to assign users to this alert
     */
    hideUpdateAlertPopover(e) {
        let state = {
            showUpdateAlertPopover: false,
        };
        this.setState(state);
    }

    /**
     * Call the service method to close this alert
     */
    closeAlert() {
        AlertService.update(this.props.alert.id, {severity: "done"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    /**
     * Call the service method to restore this alert
     */
    restoreAlert() {
        AlertService.update(this.props.alert.id, {severity: "serious"})
        .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
    }

    render() {
        let date = new Date(this.props.alert.createdAt);
        date = date.getHours() + ':' + (date.getMinutes() < 10 ? '0':'') + date.getMinutes();

        let senderTeam = this.props.teams.get(this.props.alert.senderTeamId);
        return (
            <Col xs={12} sm={6} className="Alerts__Alert">
                <div className="Alerts__Alert__container">
                    <button
                        data-tip
                        data-for={"team-" + this.props.alert.id}
                        className={ 'Alerts__Alert__team-name__container Alerts__Alert__team-name__container--' + this.props.alert.severity}
                        onClick={() => (this.props.alert.senderTeamId && browserHistory.push('/overview/' + this.props.alert.senderTeamId))}>
                        <div className="Alerts__Alert__team-name">
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

                    <div className="Alerts__Alert__separator"><div></div>
                    </div>
                    <div className="Alerts__Alert__content"
                        data-tip
                        data-for={"content-" + this.props.alert.id}
                    >
                        <div>
                            <span
                                className="Alerts__Alert__title"
                            >
                                <p>
                                    {this.props.alert.title}
                                </p>
                            </span>
                            {this.props.alert.message &&
                                <div>
                                    <span className="Alerts__Alert__description">
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



                    <button className="Alerts__Alert__action--icon" onClick={this.showUpdateAlertPopover}>
                        {(Array.isArray(this.props.alert.users) && this.props.alert.users.length > 0) ?
                            <div>
                                <div
                                    className="Alerts__Alert__action--icon__avatars"
                                    data-tip
                                    data-for={"avatar-" + this.props.alert.id}
                                >
                                    { this.props.alert.users.map((id) => {
                                        return <div key={id}><Avatar src={(constants.avatarBasePath + id)} /></div>
                                    })}
                                </div>
                                <div style={{whiteSpace: 'pre-line'}}>
                                    <ReactTooltip
                                        id={"avatar-" + this.props.alert.id}
                                        place="bottom"
                                    >
                                        <span style={{whiteSpace: 'pre-line'}} className="bite">
                                            {this.props.alert.users.map((id) => {
                                                let user = this.props.users.get(id);
                                                if(user) {
                                                    return <span key={id}>{user.name}<br/></span>
                                                }
                                                return <span key={id}>Quelqu'un<br/></span>
                                            })}
                                        </span>
                                    </ReactTooltip>
                                </div>
                            </div>
                        :
                            <AccountCircleIcon />
                        }
                    </button>

                    {this.props.alert.severity != 'done' ?
                        <button className="Alerts__Alert__action--primary" onClick={this.closeAlert}>
                            <CheckIcon />
                        </button>
                        :
                        <button className="Alerts__Alert__action--primary" onClick={this.restoreAlert}>
                            <UndoIcon />
                        </button>
                    }

                    { this.state.showUpdateAlertPopover &&
                        <UpdateAlertPopover
                            alert={this.props.alert}
                            onRequestClose={this.hideUpdateAlertPopover}
                            open={this.state.showUpdateAlertPopover}
                            anchor={this.state.popoverAnchor}
                            users={this.props.users}
                        />
                    }
                </div>
            </Col>
        );
    }
}
