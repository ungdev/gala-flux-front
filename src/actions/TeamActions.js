import AppDispatcher from '../dispatchers/AppDispatcher.js';

export default {

    getTeams(teams) {

        AppDispatcher.dispatch({
            type: 'GET_TEAMS',
            teams
        });

    }

}