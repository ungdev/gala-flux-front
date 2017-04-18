import React from 'react';

export default class BarCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.team.name}
            </div>
        );
    }

}