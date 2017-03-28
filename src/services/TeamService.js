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
        // first request : get the user
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

}

export default new TeamService();