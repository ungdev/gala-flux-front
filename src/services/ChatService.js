import BaseService from './BaseService';

/**
 * Class used for all about Authentication
 */
class ChatService extends BaseService {

    constructor() {
        super('message');
    }

    /**
     * Send a new message to the server
     *
     * @param {string} text
     * @return {Promise}
     */
    sendMessage(text) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/testcreate',
                data: {text}
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new ChatService();
