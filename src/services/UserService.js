import UserActions from '../actions/UserActions';

/**
 * Class used for all about Authentication
 */
class UserService {

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
     * Make a webSocket request to delete a user
     *
     * @callback errorCallback
     *
     * @param {String} uid : the user id
     * @param {errorCallback} err
     */
    deleteUser(uid, err) {
        io.socket.request({
            method: 'delete',
            url: '/user/' + uid
        }, (resData, jwres) => {
            if (jwres.error) {
                err(jwres);
            } else {
                console.log("ok delete user : ", jwres);
            }
        });
    }

}

export default new UserService();