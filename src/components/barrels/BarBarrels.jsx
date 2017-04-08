import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import AuthStore from '../../stores/AuthStore';

import { Row, Col } from 'react-flexbox-grid';

export default class BarBarrels extends React.Component {

    constructor() {
        super();

        this.state = {
            barrels: []
        };

        // binding
        this._setBarrels = this._setBarrels.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        BarrelStore.addChangeListener(this._setBarrels);
        // init barrels list and barrelTypes list
        this._setBarrels();
    }

    componentWillUnmount() {
        // remove the stores listeners
        BarrelStore.removeChangeListener(this._setBarrels);
    }

    _setBarrels() {
        this.setState({ barrels: BarrelStore.getTeamBarrels(AuthStore.user.team) });
    }

    render() {
        return (
            <Row className="hideContainer">
                <Col md={4} className="hideContainer">
                    <h2>En stock</h2>
                    <ul>
                        {
                            this.state.barrels.map((barrel, i) => {
                                return <li key={i}>{barrel.reference}</li>
                            })
                        }
                    </ul>
                </Col>
                <Col md={4} className="hideContainer">
                    <h2>Entammés</h2>
                </Col>
                <Col md={4} className="hideContainer">
                    <h2>Terminés</h2>
                </Col>
            </Row>
        );
    }

}