import AuthStore from 'stores/AuthStore';

/**
 * This file function return another function that can be use as `onEnter` parameter
 * for react-router Route. This middleware will enforce authentatication and also check
 * permission according to `permission` parameter.
 * @param {string} permission Optionnal permission that the user should have to access the page
 * @return {function}
 */
export default function(permission) {
    return (nextState, replace, callback) => {
        // If not authorized in Redirect to /
        if(!AuthStore.team || !AuthStore.user || (permission && !AuthStore.can(permission))) {
            replace('/');
        }
        return callback();
    }
}
