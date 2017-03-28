import UserActions from '../actions/UserActions';

/**
 * Class used for all about Authentication
 */
class TeamService {

    /**
     * Make a webSocket request to get the users
     * Then return the data
     *
     * @callback errCallback
     * @callback successCallback
     *
     * @param {successCallback} success
     * @param {errCallback} err
     */
    getUsers(success, err) {
        io.socket.request({
            method: 'get',
            url: '/user'
        }, (resData, jwres) => {
            if (jwres.error) {
                return err(jwres);
            }
            return success(jwres.body);
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