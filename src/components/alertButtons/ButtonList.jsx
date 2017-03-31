import React from 'react';

import AlertButtonStore from '../../stores/AlertButtonStore';

export default class ButtonList extends React.Component {

    constructor() {
        super();

        this.state = {
            buttons: []
        };

        // binding
        this._onAlertButtonStoreChange = this._onAlertButtonStoreChange.bind(this);
    }

    componentDidMount() {
        // listen stores changes
        AlertButtonStore.addChangeListener(this._onAlertButtonStoreChange);
    }

    componentWillUnmount() {
        // remove the stores listeners
        AlertButtonStore.removeChangeListener(this._onAlertButtonStoreChange);
    }

    _onAlertButtonStoreChange() {
        this.setState({ buttons: AlertButtonStore.buttons });
    }

    render() {
        return (
            <div>
                {
                    this.state.buttons.map((button) => {
                        return <div key={button.id}>{button.title}</div>
                    })
                }
            </div>
        );
    }

}