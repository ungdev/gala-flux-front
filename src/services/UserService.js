import UserActions from '../actions/UserActions';

/**
 * Class used for all about Authentication
 */
class TeamService {

    /**
     * Make a webSocket request to get the users
     * Then trigger an action to update the Store with the data
     *
     * @callback errCallback
     *
     * @param {errCallback} err
     */
    getUsers(err) {
        // first request : get the user
        io.socket.request({
            method: 'get',
            url: '/user'
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                UserActions.getUsers(jwres.body);
            }
        });
    }

}

export default new TeamService();