import UserActions from '../actions/UserActions';

/**
 * Class used for all about Authentication
 */
class UserService {


    /**
     * Pull user data from the server
     *
     * @param  {string} id  id of the user you wan to get
     * @return {Promise}    Promise that resolve to user data
     */
    getUser(id) {
        return new Promise((resolve, reject) => {
            // first request : get the user
            iosocket.request({
                method: 'get',
                url: '/user/' + id
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(jwres.error);
                }
                return resolve(resData);
            });
        });
    }

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
        iosocket.request({
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
        iosocket.request({
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
        iosocket.request({
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

export default new UserService();
