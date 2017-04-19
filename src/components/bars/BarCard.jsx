import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelsInfo from './BarrelsInfo.jsx';
import AlertsInfo from './AlertsInfo.jsx';
import Badge from 'material-ui/Badge';
import Face from 'material-ui/svg-icons/action/face';

import * as color from 'material-ui/styles/colors';
require('../../styles/bars/BarCard.scss');

export default class BarCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            users: props.users,
            barrels: props.barrels,
            alerts: props.alerts
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            team: nextProps.team,
            users: nextProps.users,
            alerts: nextProps.alerts,
            barrels: nextProps.barrels
        });
    }

    render() {
        const styles = {
            title: {
                fontSize: 20,
                fontWeight: "bold"
            },
            badge: {
                background: this.state.users && this.state.users.length > 0 ? color.teal600 : color.red600
            }
        };

        return (
            <Card className="BarCard">
                <div className="UsersLogged">
                    <Badge
                        badgeContent={this.state.users ? this.state.users.length : 0}
                        primary={true}
                        badgeStyle={styles.badge}
                    >
                        <Face />
                    </Badge>
                </div>
                <CardHeader
                    titleStyle={styles.title}
                    title={this.state.team.name}
                    subtitle={this.state.team.location}
                />
                <CardText>
                    <AlertsInfo alerts={this.state.alerts} />
                    <BarrelsInfo barrels={this.state.barrels} />
                </CardText>
            </Card>
        );
    }

}