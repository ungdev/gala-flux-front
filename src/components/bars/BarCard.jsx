import React from 'react';
import router from 'router';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelsInfo from 'components/bars/BarrelsInfo.jsx';
import AlertsInfo from 'components/bars/AlertsInfo.jsx';
import Badge from 'material-ui/Badge';
import Face from 'material-ui/svg-icons/action/face';

import * as color from 'material-ui/styles/colors';
require('styles/bars/BarCard.scss');

export default class BarCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            users: props.users ? props.users.length : 0,
            barrels: props.barrels,
            alerts: props.alerts,
            headerHovered: false
        };

        this._showBarHome = this._showBarHome.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            team: nextProps.team,
            users: nextProps.users ? nextProps.users.length : 0,
            alerts: nextProps.alerts,
            barrels: nextProps.barrels
        });
    }

    _showBarHome() {
        router.navigate('barhome.id', {id: this.state.team.id});
    }

    render() {
        const styles = {
            title: {
                fontSize: 20,
                fontWeight: "bold",
                borderBottom: "1px solid white"
            },
            badge: {
                background: this.state.users > 0 ? color.teal600 : color.red600
            }
        };

        return (
            <Card className="BarCard"
                onClick={this._showBarHome}
            >
                <div className="UsersLogged">
                    <Badge
                        badgeContent={this.state.users}
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
                    <BarrelsInfo
                      barrels={this.state.barrels}
                      bucklessSells={this.props.bucklessSells}
                      bucklessReloads={this.props.bucklessReloads}
                    />
                </CardText>
            </Card>
        );
    }

}
