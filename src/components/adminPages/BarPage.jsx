import React from 'react';

import BarList from 'components/bars/BarList.jsx';

export default class BarPage extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <BarList />
            </div>
        );
    }

}
