import React from 'react';

import { Col } from 'react-flexbox-grid';
import Warning from 'material-ui/svg-icons/alert/warning';

export default class AlertsInfoItem extends React.Component {

    constructor(props) {
        super(props);

        this.setState = {
            color: props.color,
            number: props.number
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            color: nextProps.color,
            number: nextProps.number
        });
    }

    render() {
        return (
            <Col xs={4} className="CardInfo">
                <Warning color={this.state.color} />
                <span>{this.state.number}</span>
            </Col>
        );
    }

}