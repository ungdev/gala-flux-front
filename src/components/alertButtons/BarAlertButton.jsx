import React from 'react';

require('../../styles/bar/AlertButton.scss');

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            alert: nextProps.alert
        });
    }

    render() {

        if (this.state.alert) {
            return (
                <div>
                    alert !
                </div>
            );
        }

        return (
            <div>
                <button className="AlertButton_button">
                    {this.state.button.title}
                </button>
            </div>
        );
    }

}