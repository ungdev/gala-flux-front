import React from 'react';

export default class BarHome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barId: props.barId
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barId: nextProps.barId,
        });
    }

    render() {
        return (
            <div>
                {this.state.barId}
            </div>
        );
    }

}