import AppDispatcher from 'lib/AppDispatcher.js';

export default {

    getTeams(teams) {

        AppDispatcher.dispatch({
            type: 'GET_TEAMS',
            teams
        });

    }

}