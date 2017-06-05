import React from 'react';

/**
 * This layout does nothing it is used to for nested routes when we don't want nested components
 */
export default class UselessLayout extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
