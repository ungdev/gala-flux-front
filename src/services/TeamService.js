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
     * @callback doneCallback
     *
     * @param {String} teamId : the team to delete
     * @param {doneCallback} callback
     */
    deleteTeam(teamId, callback) {
        iosocket.request({
            method: 'delete',
            url: '/team/' + teamId
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback();
        });
    }

    /**
     * Make a request to create a new team
     *
     * @callback doneCallback
     *
     * @param {object} data
     * @param {doneCallback} callback
     */
    createTeam(data, callback) {
        iosocket.request({
            method: 'post',
            url: '/team',
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback();
        });
    }

    /**
     * Make a request to update a team
     *
     * @callback doneCallback
     *
     * @param {string} teamId
     * @param {object} data
     * @param {doneCallback} callback
     */
    updateTeam(teamId, data, callback) {
        iosocket.request({
            method: 'put',
            url: '/team/' + teamId,
            data
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback();
        });
    }

}

export default new TeamService();
