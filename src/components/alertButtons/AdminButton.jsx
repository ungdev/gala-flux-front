import React from 'react';

import Chip from 'material-ui/Chip';

export default class AdminButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button
        }
    }

    render() {
        return (
            <Chip
                onTouchTap={_ => this.props.update(this.state.button)}
            >
                {this.state.button.title}
            </Chip>
        );
    }

}