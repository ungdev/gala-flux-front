import TeamActions from '../actions/TeamActions';

/**
 * Class used for all about Authentication
 */
class TeamService {

    /**
     * Make a webSocket request to get the teams
     * Then trigger an action to update the Store with the data
     *
     * @callback successCallback
     * @callback errCallback
     *
     * @param {successCallback} success
     * @param {errCallback} err
     */
    getTeams(success, err) {
        io.socket.request({
            method: 'get',
            url: '/team'
        }, (resData, jwres) => {
            if (jwres.error) {
                return err(jwres);
            }
            return success(jwres.body);
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
        io.socket.request({
            method: 'delete',
            url: '/team/' + teamId
        }, (resData, jwres) => {
            jwres.error ? callback(jwres.error) : callback();
        });
    }

}

export default new TeamService();