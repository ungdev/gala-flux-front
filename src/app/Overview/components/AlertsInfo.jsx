import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';
import WarningIcon from 'material-ui-icons/Warning';

import { teal, orange, red } from 'material-ui/colors';

/**
 * @param {Object} alertList
 */
export default class AlertsInfo extends React.Component {

    constructor(props) {
        super(props);

        this.severities = {
            done: teal[600],
            warning: orange[600],
            serious: red[600]
        };
    }


    render() {
        let severities = Object.keys(this.severities);
        let emptyCounter = 0;
        return (
            <div className="Overview__CardInfo__container">
                <div>
                    <div className="Overview__CardInfo__title">Alertes :</div>
                    <Row>
                        {
                            severities.map(severity => {
                                if (this.props.alertList[severity] && this.props.alertList[severity].length > 0) {
                                    return <Col xs={4} className="Overview__CardInfo" key={severity}>
                                            <WarningIcon color={this.severities[severity]} />
                                            <span>{this.props.alertList[severity].length}</span>
                                        </Col>
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
            </div>
        );
    }

}
