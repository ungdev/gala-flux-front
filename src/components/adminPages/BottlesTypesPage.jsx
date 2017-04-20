import React from 'react';

import BottleTypeList from '../bottles/BottleTypeList.jsx';

export default class BottlesTypesPage extends React.Component {

    render() {
        return (
            <div className={this.props.className}>
                <BottleTypeList />
            </div>
        );
    }

}
