import TeamActions from '../actions/TeamActions';

/**
 * Class used for all about Authentication
 */
class TeamService {

    /**
     * Make a webSocket request to get the teams
     * Then call the callback with the result
     *
     * @callback successCallback
     * @callback errCallback
     *
     * @param {successCallback} success
     * @param {errCallback} err
     */
    getTeams(success, err) {
        iosocket.request({
            method: 'get',
            url: '/team'
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                success(jwres.body);
            }
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
     * Make a request to update a new team
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