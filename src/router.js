// Router5
import { RouterProvider } from 'react-router5';
import createRouter from 'router5';
import loggerPlugin from 'router5/plugins/logger';
import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';

// Config
import routes from 'config/routes';

/**
 * Singleton instance of router5
 */
let router = null;

let routerSingleton = () => {
    if(!router) {
        // Init router
        router = createRouter(routes, {
            strictQueryParams: false,
            defaultRoute: 'home'
        })
        // .usePlugin(loggerPlugin) // uncomment if you want router loggin
        .usePlugin(browserPlugin({
            useHash: false
        }))
        .usePlugin(listenersPlugin())
        .start();
    }
    return router;
}

export default routerSingleton();
