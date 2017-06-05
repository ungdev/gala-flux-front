import React from 'react';

require('./Center.scss');


/**
 * This component will print children centered verticaly and horizontaly.
 * It will use `height:100%` keep that in mind when you put style on the container.
 */
export default class Center extends React.Component {
    render() {
        return (
            <div className="Center">
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
