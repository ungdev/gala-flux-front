import React from 'react';

import { Row } from 'react-flexbox-grid';
import AlertsInfoItem from './AlertsInfoItem.jsx';

import * as color from 'material-ui/styles/colors';

export default class AlertsInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alerts: props.alerts
        };

        this.severities = {
            "done": color.teal600,
            "warning": color.orange600,
            "serious": color.red600
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            alerts: nextProps.alerts
        });
    }

    render() {
        let severities = Object.keys(this.severities);
        let emptyCounter = 0;

        return (
            <div className="CardInfo_container">
                {
                    this.props.alerts &&
                    <div>
                        <div className="CardInfo_title">Alertes :</div>
                        <Row>
                            {
                                severities.map(severity => {
                                    if (this.state.alerts[severity] && this.state.alerts[severity].length > 0) {
                                        return <AlertsInfoItem
                                                    color={this.severities[severity]}
                                                    number={this.state.alerts[severity].length}
                                                />
                                    } else {
                                        emptyCounter++;
                                    }
                                })
                            }
                        </Row>
                        {
                            emptyCounter === severities.length &&
                            <div style={{textAlign: "center"}}>
                                Aucune alerte
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }

}