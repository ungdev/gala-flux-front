import React from 'react';

import AlertButtonStore from '../../stores/AlertButtonStore';

import BarAlertButton from './BarAlertButton.jsx';

export default class BarAlertButtons extends React.Component {

    constructor() {
        super();

        this.state = {
            buttons: {}
        };

        this.AlertButtonStoreToken = null;

        // binding
        this._setButtons = this._setButtons.bind(this);
    }

    componentDidMount() {
        // fill the alert buttons store
        AlertButtonStore.loadData(null)
            .then(data => {
                // ensure that last token doesn't exist anymore.
                AlertButtonStore.unloadData(this.AlertButtonStoreToken);
                // save the component token
                this.AlertButtonStoreToken = data.token;

                // listen the stores changes
                AlertButtonStore.addChangeListener(this._setButtons);
                // init teams
                this._setButtons();
            })
            .catch(error => console.log("fill BarAlertButtons error", error));
    }

    componentWillUnmount() {
        // clear store
        AlertButtonStore.unloadData(this.AlertButtonStoreToken);
        // remove the listener
        AlertButtonStore.removeChangeListener(this._setButtons);
    }

    /**
     * Update the buttons in the state with the buttons from the alert buttons store
     */
    _setButtons() {
        const storeButtons = AlertButtonStore.buttons;
        let buttons = {};

        for (let button of storeButtons) {
            if (!buttons[button.category]) {
                buttons[button.category] = [];
            }
            buttons[button.category].push(button);
        }

        this.setState({ buttons });
    }

    render() {
        const categories = Object.keys(this.state.buttons);

        return(
            <div>
                {
                    categories.map((category, i) => {
                        return  <div key={i}>
                                    <h3>{category}</h3>
                                    {
                                        this.state.buttons[category].map(button => {
                                            return <BarAlertButton key={button.id} button={button} />
                                        })
                                    }
                                </div>
                    })
                }
            </div>
        );
    }

}