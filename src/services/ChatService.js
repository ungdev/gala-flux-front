import ChatActions from '../actions/ChatActions';

/**
 * Class used for all about Authentication
 */
class ChatService {

    /**
     * Send a new message to the server
     *
     * @callback errorCallback
     *
     * @param {string} text
     * @param {errorCallback} error
     */
    sendMessage(text, error) {
        io.socket.request({
            method: 'post',
            url: '/testcreate',
            data: {text}
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            ChatActions.newMessage("test");
        });
    }

    /**
     * Get the messages
     *
     * @param error
     */
    getMessages(error) {
        io.socket.request({
            method: 'get',
            url: '/message'
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            ChatActions.getMessages(resData);
        });
    }

}

export default new ChatService();