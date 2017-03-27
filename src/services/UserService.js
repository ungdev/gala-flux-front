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

    /**
     * Make a webSocket request to update a user
     *
     * @callback erroCallback
     *
     * @param {String} uid : the user id
     * @param {object} data : the attributes to update
     * @param {erroCallback} err
     */
    updateUser(uid, data, err) {
        io.socket.request({
            method: 'put',
            url: '/user/' + uid,
            data
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                console.log("ok update user : ", jwres);
            }
        });
    }

}

export default new TeamService();