import React from 'react';

import StockScene from 'app/Stocks/StockScene.jsx';

require('./pages.scss');

export default class StockPage extends React.Component {
    render() {
        return (
            <StockScene />
        );
    }
}
