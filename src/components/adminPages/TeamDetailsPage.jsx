import React from 'react';
import { routeNode } from 'react-router5';

import TeamStore from '../../stores/TeamStore';
import UserStore from '../../stores/UserStore';

import TeamDetails from '../teams/TeamDetails.jsx';

export default class TeamDetailsPage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            id: (props.route ? props.route.params.id : null),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: (nextProps.route ? nextProps.route.params.id : null),
        });
    }

    render() {
        return (
            <TeamDetails id={this.state.id} />
        );
    }
}
