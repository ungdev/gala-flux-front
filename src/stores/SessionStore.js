import BaseStore from 'stores/BaseStore';
import SessionService from 'services/SessionService';

class SessionStore extends BaseStore {

    constructor() {
        super('session', SessionService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get sessions() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions events
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
        }
    }

}

export default new SessionStore();
