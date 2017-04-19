import React from 'react';

import BarrelTypeList from '../barrels/BarrelTypeList.jsx';

export default class BarrelsTypesPage extends React.Component {

    render() {
        return (
            <div className={this.props.className}>
                <BarrelTypeList />
            </div>
        );
    }

}
