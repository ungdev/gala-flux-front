import React from 'react';

import AdminMenu from 'app/Layout/AdminMenu.jsx';

require('./pages.scss');

export default class AdminPage extends React.Component {
    render() {
        return (
            <div className="pages__VerticalSplitLayout">
                <div className="pages__VerticalSplitLayout__menu">
                    <AdminMenu />
                </div>
                {this.props.children}
            </div>
        );
    }
}
