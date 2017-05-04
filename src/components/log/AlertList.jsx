import React from 'react';
import Alert from './Alert.jsx';
import { Row } from 'react-flexbox-grid';
require('../../styles/log/AlertList.scss');

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
        return (
            <div className="alert-list">
                <Row className="alert-list__row">
                    {
                        this.state.alerts.map((alert, i) => {
                            return <Alert alert={alert} key={i} />
                        })
                    }
                </Row>
            </div>
        );
    }
}
