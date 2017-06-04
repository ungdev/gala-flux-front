import React from 'react';
import Alert from 'components/log/Alert.jsx';
import { Row } from 'react-flexbox-grid';
require('styles/log/AlertList.scss');

/**
 * @param {ModelCollection} alerts
 * @param {ModelCollection} users
 * @param {ModelCollection} teams
 */
export default class AlertList extends React.Component {

    render() {
        let assigned = false;
        return (
            <div className="alert-list">
                <Row className="alert-list__row">
                    {
                        this.props.alerts.map((alert, i) => {
                            let ret = [];
                            if(!assigned && alert.users.length != 0 && alert.severity != 'done' && i != 0) {
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
