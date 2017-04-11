import BaseStore from './BaseStore';

import AlertButtonService from '../services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super('alertbutton', AlertButtonService.getAlertButtons);

        this.subscribe(() => this._handleActions.bind(this));

        // binding
        this._handleModelEvents = this._handleModelEvents.bind(this);
    }

    get buttons() {
        return this._modelData;
    }

    /**
     * Handle webSocket events about the AlertButton model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._delete(e.id);
                break;
            case "created":
                this._set(e.id, e.data);
                break;
        }
    }

    _handleActions(action) {
        switch(action.type) {}
    }

}

export default new AlertButtonStore();
