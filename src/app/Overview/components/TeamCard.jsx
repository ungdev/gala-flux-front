import React from 'react';
import { browserHistory } from 'react-router';

import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import BarrelsInfo from 'app/Overview/components/BarrelsInfo.jsx';
import AlertsInfo from 'app/Overview/components/AlertsInfo.jsx';
import Badge from 'material-ui/Badge';
import FaceIcon from 'material-ui-icons/Face';
import ReactTooltip from 'react-tooltip';

import { teal, red } from 'material-ui/colors';
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
                        color="accent"
                        classes={{badge: this.props.userNames.length > 0 ? 'Overview__TeamCard__UsersLogged__badge--success' : 'Overview__TeamCard__UsersLogged__badge--danger'}}
                    >
                        <FaceIcon />
                    </Badge>
                </div>
                { this.props.userNames.length ?
                    <ReactTooltip
                        id={'Overview__TeamCard--' + this.props.team.id}
                        place="bottom"
                        style={{textAlign: 'center', zIndex: '10'}}
                    >
                        Utilisateurs connectés :
                        { '\n' + this.props.userNames.sort((a, b) => a.localeCompare(b)).join('\n') }
                    </ReactTooltip>
                :null
                }

                <CardContent>
                    <Typography type="headline" className="Overview__TeamCard__header" style={styles.title}>
                        {this.props.team.name}
                    </Typography>
                    <Typography type="subheading" color="secondary">
                        {this.props.team.location}
                    </Typography>
                    <AlertsInfo alertList={this.props.alertList} team={this.props.team}/>
                    <BarrelsInfo prices={this.props.prices} barrelList={this.props.barrelList} barrelCount={this.props.barrelCount} />
                </CardContent>
            </Card>
        );
    }

}
