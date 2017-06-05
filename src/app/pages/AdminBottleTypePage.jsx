import React from 'react';

import BottleTypeScene from 'app/Stocks/Bottles/BottleTypeScene.jsx';

require('./pages.scss');

export default class AdminBottleTypePage extends React.Component {
    render() {
        return (
            <div className="pages__MonoPageLayout">
                <BottleTypeScene />
            </div>
        );
    }
}
