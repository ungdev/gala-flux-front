import React from 'react';
import Alert from 'components/log/Alert.jsx';
import { Row } from 'react-flexbox-grid';
require('styles/log/AlertList.scss');

export default class AlertList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alerts: props.alerts
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            alerts: props.alerts
        });
    }

    render() {
        let assigned = false;
        return (
            <div className="alert-list">
                <Row className="alert-list__row">
                    {
                        this.state.alerts.map((alert, i) => {
                            let ret = [];
                            if(!assigned && alert.users.length != 0 && alert.severity != 'done' && i != 0) {
                                assigned = true;
                                ret.push(<h3 style={{width: '100%', marginBottom: '0'}}>Alertes assignées</h3>);
                            }
                            ret.push(<Alert alert={alert} key={i} />);
                            return ret;
                        })
                    }
                </Row>
            </div>
        );
    }
}
