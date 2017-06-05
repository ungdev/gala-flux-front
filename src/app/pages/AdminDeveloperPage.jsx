import React from 'react';

import DeveloperScene from 'app/Developer/DeveloperScene.jsx';

require('./pages.scss');

export default class AdminDeveloperPage extends React.Component {
    render() {
        return (
            <div className="pages__MonoPageLayout">
                <DeveloperScene />
            </div>
        );
    }
}
