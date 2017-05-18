import React from 'react';

import Alerts from 'components/log/Alerts.jsx';
import AlertActions from 'actions/AlertActions.jsx';

export default class AlertPage extends React.Component {
    render() {
        return (
            <div className={this.props.className} onClick={AlertActions.alertViewed}>
                <Alerts />
            </div>
        );
    }
}
