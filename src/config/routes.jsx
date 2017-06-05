import React from 'react';
import { Route, IndexRoute } from 'react-router'

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
        <IndexRoute component={LoginPage}/>
        <Route path="/dashboard" component={DashboardPage}>
            <Route path="/alerts" component={DashboardPage}/>
            <Route view="Full" path="/chat" component={DashboardPage}>
                <Route view="Full" path="/chat/**" component={DashboardPage}/>
            </Route>
        </Route>
        <Route path="/myspace" component={MySpacePage}>
            <Route view="Full" path="/mystock" component={MySpacePage}/>
        </Route>
        <Route path="/stocks" component={StockPage}/>
        <Route path="/overview" component={UselessLayout}>
            <IndexRoute component={OverviewPage} />
            <Route view="Full" path="/overview/:id" component={TeamSpacePage} />
        </Route>
        <Route path="/admin" component={AdminPage}>
            <IndexRoute component={AdminTeamsPage}/>
            <Route path="/admin/teams" component={AdminTeamsPage}>
                <Route view="Full" path="/admin/team/:id" component={TeamSpacePage}/>
            </Route>
            <Route path="/admin/bottles" component={AdminBottleTypePage}/>
            <Route path="/admin/barrels" component={AdminBarrelTypePage}/>
            <Route path="/admin/alertbuttons" component={AdminAlertButtonPage}/>
            <Route path="/admin/developer" component={AdminDeveloperPage}/>
        </Route>
    </Route>
)
//
//     <Route view="Full" path="/overview/:id/stock" component={TeamSpacePage}/>
// </Route>
    //
    // <Route path="/" component={App}>
    //   <Route path="/repos" component={Repos}/>
    //   <Route path="/repos/:userName/:repoName" component={Repo}/>
    //   <Route path="/about" component={About}/>
    // </Route>
//
// { name: 'home', path: '/'},
// { name: 'alert', path: '/alert', title: 'Alertes'},
// { name: 'barhome', path: '/bar', title: 'Bar'},
//     { name: 'barhome.id', path: '/:id', title: 'Bar'},
// { name: 'bars', path: '/bars', title: 'Bars' },
// { name: 'chat', path: '/chat', title: 'Chat' },
//     { name: 'chat.channel', path: '/*channel', title: (route) => {
//         switch(route.params.channel.split(':')[0]) {
//             case 'public': return 'Publique : ' + route.params.channel.split(':')[1];
//             case 'group': return 'Groupe : ' + route.params.channel.split(':')[1];
//             case 'private': return 'Privé : ' + route.params.channel.split(':')[1];
//             default: return 'Chat';
//         }
//     }},
// { name: 'stock', path: '/stock', title: 'Gestion du stock' },
// { name: 'admin', path: '/admin', title: 'Administration' },
//     { name: 'admin.teams', path: '/team', title: 'Gestion des équipes' },
//         { name: 'admin.teams.id', path: '/:id', title: 'Gestion des équipes' },
//     { name: 'admin.barrels', path: '/barrel', title: 'Gestion des fûts' },
//     { name: 'admin.bottles', path: '/bottle', title: 'Gestion des bouteilles' },
//     { name: 'admin.alerts', path: '/alerts', title: 'Gestion des alertes' },
//     { name: 'admin.developer', path: '/developer', title: 'Espace développeur' },
