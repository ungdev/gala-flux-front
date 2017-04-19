import React from 'react';

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button
        });
    }

    render() {
        return(
            <div>
                {this.state.button.title}
            </div>
        );
    }

}