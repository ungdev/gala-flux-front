import BaseStore from 'stores/BaseStore';

import AlertButtonService from 'services/AlertButtonService';

class AlertButtonStore extends BaseStore {

    constructor() {
        super('alertButton', AlertButtonService);
    }

}

module.exports = new AlertButtonStore();
export default module.exports;
