import React from 'react';
import { browserHistory } from 'react-router';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelsInfo from 'app/Overview/components/BarrelsInfo.jsx';
import AlertsInfo from 'app/Overview/components/AlertsInfo.jsx';
import Badge from 'material-ui/Badge';
import FaceIcon from 'material-ui/svg-icons/action/face';
import ReactTooltip from 'react-tooltip';

import * as color from 'material-ui/styles/colors';
require('./TeamCard.scss');

/**
 * @param {Object} userNames
 * @param {Object} prices
 * @param {Object} barrelList
 * @param {Object} barrelCount
 * @param {Object} alertList
 */
export default class TeamCard extends React.Component {

    constructor(props) {
        super(props);

        this.showBarHome = this.showBarHome.bind(this);
    }

    showBarHome() {
        browserHistory.push('/overview/' + this.props.team.id)
    }

    render() {
        const styles = {
            title: {
                fontSize: 20,
                fontWeight: "bold",
            },
            badge: {
                background: this.props.userNames.length > 0 ? color.teal600 : color.red600
            }
        };

        return (
            <Card className="Overview__TeamCard"
                onClick={this.showBarHome}
            >
                <div className="Overview__TeamCard__UsersLogged"
                    data-tip
                    data-for={'Overview__TeamCard--' + this.props.team.id}
                >
                    <Badge
                        badgeContent={this.props.userNames.length}
                        primary={true}
                        badgeStyle={styles.badge}
                    >
                        <FaceIcon />
                    </Badge>
                </div>
                { this.props.userNames.length &&
                    <ReactTooltip
                        id={'Overview__TeamCard--' + this.props.team.id}
                        place="bottom"
                        style={{textAlign: 'center', zIndex: '10'}}
                    >
                        Utilisateurs connectés :
                        { '\n' + this.props.userNames.sort((a, b) => a.localeCompare(b)).join('\n') }
                    </ReactTooltip>
                }

                <CardHeader
                    titleStyle={styles.title}
                    title={this.props.team.name}
                    subtitle={this.props.team.location}
                    className="Overview__TeamCard__header"
                />
                <CardText>
                    <AlertsInfo alertList={this.props.alertList} team={this.props.team}/>
                    <BarrelsInfo prices={this.props.prices} barrelList={this.props.barrelList} barrelCount={this.props.barrelCount} />
                </CardText>
            </Card>
        );
    }

}
