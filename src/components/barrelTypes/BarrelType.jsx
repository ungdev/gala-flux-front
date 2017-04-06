import React from 'react';

export default class BarrelType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type
        }
    }

    render() {
        return (
            <div>
                {this.state.type.name}
            </div>
        );
    }

}