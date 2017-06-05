import React from 'react';
import Alert from 'app/Alerts/components/Alert.jsx';
import { Row } from 'react-flexbox-grid';

require('./AlertList.scss');

/**
 * @param {ModelCollection} alerts
 * @param {ModelCollection} users
 * @param {ModelCollection} teams
 */
export default class AlertList extends React.Component {

    render() {
        let assigned = false;
        return (
            <div className="Alerts__AlertList">
                <Row className="Alerts__AlertList__row">
                    {
                        this.props.alerts.map((alert, i) => {
                            let ret = [];
                            if(!assigned && alert.users.length != 0 && alert.severity != 'done') {
                                assigned = true;
                                ret.push(<h3 style={{width: '100%', marginBottom: '0'}}>Alertes assignées</h3>);
                            }
                            ret.push(<Alert
                                alert={alert}
                                users={this.props.users}
                                teams={this.props.teams}
                                key={i}
                            />);
                            return ret;
                        })
                    }
                </Row>
            </div>
        );
    }
}
