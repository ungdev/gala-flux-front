import React from 'react';

import Barrel from 'material-ui/svg-icons/device/battery-full';
import { Col } from 'react-flexbox-grid';

export default class BarrelsInfoItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            color: props.color,
            number: props.number
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            color: nextProps.color,
            number: nextProps.number,
        });
    }

    render() {
        return (
            <Col xs={4} className="CardInfo">
                <Barrel color={this.state.color} />
                <span>{this.state.number}</span>
            </Col>
        );
    }

}