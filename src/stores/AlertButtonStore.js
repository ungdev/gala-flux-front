import BaseStore from './BaseStore';

import AlertButtonService from '../services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super('alertbutton', AlertButtonService.getAlertButtons);

        this.subscribe(() => this._handleActions.bind(this));

        // binding
        this._handleModelEvents = this._handleModelEvents.bind(this);
        this._deleteButton = this._deleteButton.bind(this);
    }

    get buttons() {
        return this._modelData;
    }

    set buttons(v) {
        this._modelData = v;
        this.emitChange();
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
    _handleModelEvents(e) {
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
        switch(action.type) {}
    }

}

export default new AlertButtonStore();
