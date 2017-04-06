import React from 'react';

import BarrelTypeStore from '../../stores/BarrelTypeStore';

import BarrelType from './BarrelType.jsx';

export default class TypesList extends React.Component {

    constructor() {
        super();

        this.state = {
            types: []
        };

        // bindings
        this._onBarrelTypeStoreChange = this._onBarrelTypeStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        BarrelTypeStore.addChangeListener(this._onBarrelTypeStoreChange);
        // init team list
        this.setState({ types: BarrelTypeStore.types });
    }

    componentWillUnmount() {
        // remove the stores listeners
        BarrelTypeStore.removeChangeListener(this._onBarrelTypeStoreChange);
    }

    _onBarrelTypeStoreChange() {
        this.setState({ types: BarrelTypeStore.types });
    }

    render() {
        return (
            <div>
                {
                    this.state.types.map(type => {
                        return <BarrelType key={type.id} type={type} />
                    })
                }
            </div>
        );
    }

}