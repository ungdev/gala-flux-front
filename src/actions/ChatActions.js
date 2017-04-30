import AppDispatcher from '../dispatchers/AppDispatcher.js';

export default {

    newMessage(message) {
        AppDispatcher.dispatch({
            type: 'NEW_MESSAGE',
            message
        });
    },

    getMessages(messages) {
        AppDispatcher.dispatch({
            type: 'GET_MESSAGES',
            messages
        });
    }
}
