import React from 'react';

import TeamDetails from 'components/teams/TeamDetails.jsx';

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
            <div className={this.props.className}>
                <TeamDetails id={this.state.id} />
            </div>
        );
    }
}
