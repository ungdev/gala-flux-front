import BaseService from './BaseService';
import {ApiError} from '../errors';

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
        return new Promise((resolve, reject) => {
            iosocket.get('/message/channels', (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new ChatService();
