import BaseStore from 'stores/BaseStore';
import SessionService from 'services/SessionService';

class SessionStore extends BaseStore {

    constructor() {
        super('session', SessionService);
    }

}

module.exports = new SessionStore();
export default module.exports;
