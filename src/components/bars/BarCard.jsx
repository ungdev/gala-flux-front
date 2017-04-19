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
    }

    render() {
        const styles = {
            title: {
                fontSize: 20,
                fontWeight: "bold"
            },
            badge: {
                background: this.props.users && this.props.users.length > 0 ? color.teal600 : color.red600
            }
        };

        return (
            <Card className="BarCard">
                <div className="UsersLogged">
                    <Badge
                        badgeContent={this.props.users ? this.props.users.length : 0}
                        primary={true}
                        badgeStyle={styles.badge}
                    >
                        <Face />
                    </Badge>
                </div>
                <CardHeader
                    titleStyle={styles.title}
                    title={this.props.team.name}
                    subtitle={this.props.team.location}
                />
                <CardText>
                    <AlertsInfo alerts={this.props.alerts} />
                    <BarrelsInfo barrels={this.props.barrels} />
                </CardText>
            </Card>
        );
    }

}