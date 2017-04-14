import React from 'react';

import TypesList from '../barrelTypes/TypesList.jsx';

export default class BarrelsTypesPage extends React.Component {

    render() {
        return (
            <div className={this.props.className}>
                <h2>Types de fût</h2>
                <TypesList />
            </div>
        );
    }

}
