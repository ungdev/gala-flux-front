import AppDispatcher from '../dispatchers/AppDispatcher.js';

export default {

    getUsers(users) {

        AppDispatcher.dispatch({
            type: 'GET_USERS',
            users
        });

    }

}