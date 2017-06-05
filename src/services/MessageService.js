import BaseService from 'services/BaseService';
import {ApiError} from 'lib/errors';

/**
 * Class used for all about Authentication
 */
class MessageService extends BaseService {

    constructor() {
        super('message');
    }

    /**
     * Pull the current list of channels from the server
     *
     * @return {Promise}    Promise that resolve to the list of channels
     */
    getChannels() {
        return this.request('get', '/message/channels');
    }

}

export default new MessageService();
