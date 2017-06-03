import BaseStore from 'stores/BaseStore';
import UserService from 'services/UserService';

class UserStore extends BaseStore {

    constructor() {
        super('user', UserService);

        // Force subscribe
        this._forceSubscribe = true;
    }

    get users() {
        return this.getUnIndexedData();
    }

}

module.exports = new UserStore();
export default module.exports;
