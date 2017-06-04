import React from 'react';
import router from 'router';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import BarrelsInfo from 'components/bars/BarrelsInfo.jsx';
import AlertsInfo from 'components/bars/AlertsInfo.jsx';
import Badge from 'material-ui/Badge';
import FaceIcon from 'material-ui/svg-icons/action/face';
import ReactTooltip from 'react-tooltip';

import * as color from 'material-ui/styles/colors';
require('styles/bars/BarCard.scss');

/**
 * @param {Object} userNames
 * @param {Object} prices
 * @param {Object} barrelList
 * @param {Object} barrelCount
 * @param {Object} alertList
 */
export default class BarCard extends React.Component {

    constructor(props) {
        super(props);

        this.showBarHome = this.showBarHome.bind(this);
    }

    showBarHome() {
        router.navigate('barhome.id', {id: this.props.team.id});
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
            <Card className="BarCard"
                onClick={this.showBarHome}
            >
                <div className="UsersLogged"
                    data-tip
                    data-for={'BarCard-UsersLogged-' + this.props.team.id}
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
                        id={'BarCard-UsersLogged-' + this.props.team.id}
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
                    className="BarCard__header"
                />
                <CardText>
                    <AlertsInfo alertList={this.props.alertList} team={this.props.team}/>
                    <BarrelsInfo prices={this.props.prices} barrelList={this.props.barrelList} barrelCount={this.props.barrelCount} />
                </CardText>
            </Card>
        );
    }

}
