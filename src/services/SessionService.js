import {ApiError} from 'errors';
import * as constants from '../config/constants';

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
        localStorage.setItem(constants.firebaseTokenName, firebaseToken);
        return firebaseToken;
    }

    /**
     * If there is a firebase token in the localStorage,
     * register the new session for this user
     */
    openSession() {
        const token = localStorage.getItem(constants.firebaseTokenName);
        iosocket.request({
            method: 'post',
            url: '/session/open',
            data: {token}
        }, (resData, jwres) => {
            if(jwres.error) {
                // display error => n'a pas pu register le device
                console.log("SESSION ERROR : ", jwres.body);
            } else {
                // if android device, send jwt
                if (androidInterface) {
                    androidInterface.initTopics(localStorage.getItem(constants.jwtName));
                }
                console.log("SESSION OK : ", jwres.body);
            }
        });
    }

}

export default new SessionService();