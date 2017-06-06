import AuthStore from 'stores/AuthStore';

/**
 * This middleware is used to redirect authenticated user to their homepageW
 * @return {function}
 */
export default function(permission) {
    return (nextState, replace, callback) => {
        if(AuthStore.team && AuthStore.user) {
            if(AuthStore.can('ui/alertReceiver')) {
                replace('/dashboard');
            }
            else if(AuthStore.can('ui/myspace')){
                replace('/myspace');
            }
            else {
                replace('/chat');
            }
        }
        // Redirect to for 404
        else if(nextState.location.pathname != '/') {
            replace('/');
        }
        return callback();
    }
}
