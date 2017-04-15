import React from 'react';

require('../../styles/partials/CenteredMessage.scss');


/**
 * This component will print a centered message on the container.
 * This should be used to show messages like "Theres is no item in this list"
 */
export default class CenteredMessage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="CenteredMessage">
                {this.props.children}
            </div>
        );
    }
}
