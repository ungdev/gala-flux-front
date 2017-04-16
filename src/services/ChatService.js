import {ApiError} from '../errors';

/**
 * Class used for all about Authentication
 */
class ChatService {

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

    /**
     * Make a webSocket request to get the messages
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getMessages(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {filters},
                url: '/message'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new ChatService();
