import TeamActions from '../actions/TeamActions';

/**
 * Class used for all about Authentication
 */
class TeamService {

    /**
     * Make a webSocket request to get the teams
     * Then trigger an action to update the Store with the data
     *
     * @callback errCallback
     *
     * @param {errCallback} err
     */
    getTeams(err) {
        // first request : get the user
        io.socket.request({
            method: 'get',
            url: '/team'
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                TeamActions.getTeams(jwres.body);
            }
        });
    }

}

export default new TeamService();