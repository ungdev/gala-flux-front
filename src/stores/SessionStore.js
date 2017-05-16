import BaseStore from 'stores/BaseStore';
import SessionService from 'services/SessionService';

class SessionStore extends BaseStore {

    constructor() {
        super('session', SessionService);
    }

    get sessions() {
        return this.getUnIndexedData();
    }

}

export default new SessionStore();
