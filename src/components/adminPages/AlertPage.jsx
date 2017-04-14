import React from 'react';

import Alerts from '../log/Alerts.jsx';

export default class AlertPage extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <Alerts />
            </div>
        );
    }
}
