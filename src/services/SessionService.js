import {ApiError} from 'errors';
import AuthStore from '../stores/AuthStore';

const TOKEN_NAME = 'firebaseToken';

class SessionService {

    /**
     * Look if there is a firebase token in the url
     * store it in the localStorage (or null)
     * @returns {string\null}
     */
    getFirebaseToken() {
        let firebaseToken = null;

        // get the part of the URL after '?'
        const query = (window.location.href).split("?")[1];
        if (query) {
            // look at each parameters
            const parameters = query.split("&");
            for (let i = 0; i < parameters.length; i++) {
                // if the parameter name is authorization_code, return the value
                const parameter = parameters[i].split("=");
                if (parameter[0] === "firebase") {
                    firebaseToken = parameter[1];
                }
            }
        }
        localStorage.setItem(TOKEN_NAME, firebaseToken);
        return firebaseToken;
    }

    /**
     * If there is a firebase token in the localStorage,
     * register the new session for this user
     */
    sendFirebaseToken() {
        const token = localStorage.getItem(TOKEN_NAME);
        if (token) {
            iosocket.request({
                method: 'post',
                url: '/firebase/register',
                data: {token}
            }, (resData, jwres) => {
                if(jwres.error) {
                    // display error => n'a pas pu register le device
                    console.log("SESSION ERROR : ", jwres.body);
                } else {

                }
                // if android device, send jwt
                if (androidInterface) {
                    androidInterface.initTopics(AuthStore.jwt);
                }
                console.log("SESSION OK : ", jwres.body);
            });
        }
    }

}

export default new SessionService();