import BaseStore from './BaseStore';

import AlertButtonService from '../services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._buttons = [];

        // binding
        this._handleAlertButtonEvents = this._handleAlertButtonEvents.bind(this);
        this._deleteButton = this._deleteButton.bind(this);
    }

    get buttons() {
        return this._buttons;
    }

    set buttons(v) {
        this._buttons = v;
        this.emitChange();
    }

    _init() {
        // fill the buttons attribute
        AlertButtonService.getAlertButtons((err, result) => {
            if (err) {
                console.log("get alert button err : ", err);
            } else {
                this.buttons = result;
            }
        });
        // listen model changes
        iosocket.on('alertbutton', this._handleAlertButtonEvents);
    }

    /**
     * Remove a button by id in the store
     *
     * @param {String} buttonId : the button to remove
     */
    _deleteButton(buttonId) {
        this.buttons = this.buttons.filter(button => button.id != buttonId);
    }

    /**
     * Handle webSocket events about the AlertButton model
     *
     * @param {object} e : the event
     */
    _handleAlertButtonEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._deleteButton(e.id);
                break;
            case "created":
                this.buttons.push(e.data);
                this.emitChange();
                break;
        }
    }

    _handleActions(action) {
        switch(action.type) {
            case "AUTH_JWT_SAVED":
                this._init();
                break;
        }
    }

}

export default new AlertButtonStore();
