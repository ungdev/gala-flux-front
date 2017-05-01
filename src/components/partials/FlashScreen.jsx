import React from 'react';

require('../../styles/FlashScreen.scss');

export default class FlashScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
        });
    }

    render() {
        return (
            <div className={"flash_screen" + (this.state.show ? " flash_animate" : "")}></div>
        );
    }

}