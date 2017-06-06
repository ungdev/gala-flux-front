import React from 'react';
import { Route, IndexRoute } from 'react-router'
import AuthMiddleware from 'lib/AuthMiddleware'
import DefaultMiddleware from 'lib/DefaultMiddleware'

import App from 'app/App.jsx';
import UselessLayout from 'app/Layout/UselessLayout.jsx';
import LoginPage from 'app/pages/LoginPage.jsx';
import DashboardPage from 'app/pages/DashboardPage.jsx';
import OverviewPage from 'app/pages/OverviewPage.jsx';
import TeamSpacePage from 'app/pages/TeamSpacePage.jsx';
import MySpacePage from 'app/pages/MySpacePage.jsx';
import StockPage from 'app/pages/StockPage.jsx';
import AdminPage from 'app/pages/AdminPage.jsx';
import AdminAlertButtonPage from 'app/pages/AdminAlertButtonPage.jsx';
import AdminDeveloperPage from 'app/pages/AdminDeveloperPage.jsx';
import AdminBottleTypePage from 'app/pages/AdminBottleTypePage.jsx';
import AdminBarrelTypePage from 'app/pages/AdminBarrelTypePage.jsx';
import AdminTeamsPage from 'app/pages/AdminTeamsPage.jsx';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={LoginPage} onEnter={DefaultMiddleware()}/>
        <Route path="/dashboard" component={DashboardPage} onEnter={AuthMiddleware()}>
            <Route path="/alerts" component={DashboardPage} onEnter={AuthMiddleware('ui/alertReceiver')}/>
            <Route path="/chat" component={DashboardPage}>
                <Route path="/chat/**" component={DashboardPage}/>
            </Route>
        </Route>
        <Route path="/myspace" component={MySpacePage} onEnter={AuthMiddleware('ui/myspace')}>
            <Route path="/mystock" component={MySpacePage} onEnter={AuthMiddleware('ui/stockReceiver')}/>
        </Route>
        <Route path="/stocks" component={StockPage} onEnter={AuthMiddleware('ui/stocks')}/>
        <Route path="/overview" component={UselessLayout}>
            <IndexRoute component={OverviewPage} onEnter={AuthMiddleware('ui/overview')}/>
            <Route path="/overview/:id" component={TeamSpacePage} />
        </Route>
        <Route path="/admin" component={AdminPage} onEnter={AuthMiddleware('ui/admin')}>
            <IndexRoute component={AdminTeamsPage} onEnter={AuthMiddleware('ui/admin/teams')}/>
            <Route path="/admin/teams" component={AdminTeamsPage} onEnter={AuthMiddleware('ui/admin/teams')}>
                <Route path="/admin/team/:id" component={TeamSpacePage}/>
            </Route>
            <Route path="/admin/bottles" component={AdminBottleTypePage} onEnter={AuthMiddleware('ui/admin/bottles')}/>
            <Route path="/admin/barrels" component={AdminBarrelTypePage} onEnter={AuthMiddleware('ui/admin/barrels')}/>
            <Route path="/admin/alertbuttons" component={AdminAlertButtonPage} onEnter={AuthMiddleware('ui/admin/alertbuttons')}/>
            <Route path="/admin/developer" component={AdminDeveloperPage} onEnter={AuthMiddleware('ui/admin/developer')}/>
        </Route>
        <Route path='*' component={LoginPage} onEnter={DefaultMiddleware()} />
    </Route>
)
