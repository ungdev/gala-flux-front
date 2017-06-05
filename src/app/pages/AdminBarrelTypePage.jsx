import React from 'react';

import BarrelTypeScene from 'app/Stocks/Barrels/BarrelTypeScene.jsx';

require('./pages.scss');

export default class AdminBarrelTypePage extends React.Component {
    render() {
        return (
            <div className="pages__MonoPageLayout">
                <BarrelTypeScene />
            </div>
        );
    }
}
