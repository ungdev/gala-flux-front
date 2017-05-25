import BaseService from 'services/BaseService';
import {ApiError} from 'errors';

/**
 * Class used for all about Authentication
 */
class ChatService extends BaseService {

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

export default new ChatService();
