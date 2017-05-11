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
        localStorage.setItem('firebaseToken', firebaseToken);
        return firebaseToken;
    }

}

export default new SessionService();