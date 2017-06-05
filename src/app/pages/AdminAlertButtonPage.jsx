import React from 'react';

import AdminAlertButtonScene from 'app/AlertButtons/AdminAlertButtonScene.jsx';

require('./pages.scss');

export default class AdminAlertButtonPage extends React.Component {
    render() {
        return (
            <div className="pages__MonoPageLayout">
                <AdminAlertButtonScene />
            </div>
        );
    }
}
