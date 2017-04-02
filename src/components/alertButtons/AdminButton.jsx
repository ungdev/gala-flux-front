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
                onRequestDelete={null}
                onTouchTap={null}
            >
                {this.state.button.title}
            </Chip>
        );
    }

}