// Router5
import { RouterProvider } from 'react-router5';
import createRouter from 'router5';
import loggerPlugin from 'router5/plugins/logger';
import listenersPlugin from 'router5/plugins/listeners';
import browserPlugin from 'router5/plugins/browser';

// constants
import * as constants from './config/constants';


/**
 * Singleton instance of router5
 */
let router = null;

let routerSingleton = () => {
    if(!router) {
        // Init router
        router = createRouter([
            // Route name format has to be 'tab.subtab'
            { name: 'home',          path: '/' },
            { name: 'bars',          path: '/bars' },
            { name: 'stock',         path: '/stock' },
            { name: 'admin',         path: '/admin' },
                { name: 'admin.teams',   path: '/team' },
                    { name: 'admin.teams.id',   path: '/:id' },
                { name: 'admin.barrels', path: '/barrel' },
                { name: 'admin.alerts',  path: '/alerts' },
        ], {
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
