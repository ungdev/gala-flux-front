import React from 'react';
import { Grid, Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip'
import UpdateAlertDialog from './UpdateAlertDialog.jsx';

require('../../styles/log/Alert.scss');

export default class Alert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showUpdateAlertDialog: false
        };
        this._toggleUpdateAlertDialog = this._toggleUpdateAlertDialog.bind(this);
    }

    _toggleUpdateAlertDialog() {
        // TODO: check user permissions ?
        this.setState({
            showUpdateAlertDialog: !this.state.showUpdateAlertDialog
        });
    }

    render() {
        return (
            <Col xs={12} sm={6} md={6} lg={6} className="alert">
                <div className="alert__container">
                    <div className="alert__team-name__container">
                        <div
                            data-tip
                            className="alert__team-name"
                            data-for={"team-" + this.props.alert.id}
                        >
                            {this.props.alert.sender.name}
                        </div>
                        <ReactTooltip
                            id={"team-" + this.props.alert.id}
                            place="bottom"
                        >
                            <span>{this.props.alert.sender.name}</span>
                        </ReactTooltip>
                    </div>
                    <div className="alert__content">
                        <span
                            className="alert__title"
                            data-tip
                            data-for={"title-" + this.props.alert.id}
                        >
                            <p>
                                {this.props.alert.title}
                            </p>
                        </span>
                        <ReactTooltip
                            id={"title-" + this.props.alert.id}
                            place="bottom"
                        >
                            <span>{this.props.alert.title}</span>
                        </ReactTooltip>
                        <span
                            className="alert__description"
                            data-tip
                            data-for={"message-" + this.props.alert.id}
                        >
                            <p>
                                {this.props.alert.message}
                            </p>
                        </span>
                        <ReactTooltip
                            id={"message-" + this.props.alert.id}
                            place="bottom"
                        >
                            <span>{this.props.alert.message}</span>
                        </ReactTooltip>
                    </div>
                    <button
                        className="alert__action"
                        onClick={() => this._toggleUpdateAlertDialog()}
                    >
                    </button>
                </div>
                <UpdateAlertDialog
                    show={this.state.showUpdateAlertDialog}
                    close={() => this._toggleUpdateAlertDialog()}
                    alert={this.props.alert}
                />
            </Col>
        );
    }
}
