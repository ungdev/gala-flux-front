import {ApiError} from '../errors';

/**
 * Class used for all about Teams
 */
class TeamService {

    /**
     * Pull team data from the server
     *
     * @param  {string} id  id of the team you wan to get
     * @return {Promise}    Promise that resolve to team data
     */
    getTeam(id) {
        return new Promise((resolve, reject) => {
            // first request : get the user
            iosocket.request({
                method: 'get',
                url: '/team/' + id
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(jwres.error);
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a webSocket request to get the teams
     *
     * @param {Array|null} filters
     * @return {Promise}
     */
    getTeams(filters) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                data: {
                    filters: filters
                },
                url: '/team'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to delete this team
     *
     * @param {String} teamId : the team to delete
     * @return {Promise}
     */
    deleteTeam(teamId) {
        return new Promise((resolve, reject) => {
            iosocket.delete('/team/' + teamId, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to create a new team
     *
     * @param {object} data
     * @return {Promise}
     */
    createTeam(data) {
        return new Promise((resolve, reject) => {
            iosocket.post('/team', data, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Make a request to update a team
     *
     * @callback doneCallback
     *
     * @param {string} teamId
     * @param {object} data
     * @return {Promise}
     */
    updateTeam(teamId, data) {
        return new Promise((resolve, reject) => {
            iosocket.put('/team/' + teamId, data, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

}

export default new TeamService();
