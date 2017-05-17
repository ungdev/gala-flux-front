import React from 'react';
import router from 'router';

import AdminMenu from 'components/partials/AdminMenu.jsx';
import AdminTabs from 'components/partials/AdminTabs.jsx';
import AuthStore from 'stores/AuthStore';
import ChatStore from 'stores/ChatStore';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import AlertActions from 'actions/AlertActions.jsx';

import AlertPage from 'components/adminPages/AlertPage.jsx';
import ChatPage from 'components/adminPages/ChatPage.jsx';
import StockPage from 'components/adminPages/StockPage.jsx';
import BarPage from 'components/adminPages/BarPage.jsx';
import BarrelsTypesPage from 'components/adminPages/BarrelsTypesPage.jsx';
import BottlesTypesPage from "components/adminPages/BottlesTypesPage.jsx";
import AlertButtonsPage from 'components/adminPages/AlertButtonsPage.jsx';
import TeamListPage from 'components/adminPages/TeamListPage.jsx';
import TeamDetailsPage from 'components/adminPages/TeamDetailsPage.jsx';


require('styles/homepages/AdminHomepage.scss');

/**
 * @param {Object} route Route object given by the router
 */
export default class AdminHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
        };

        // binding
        this._handleTabChange = this._handleTabChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    /**
     * On tab change, navigate to new uri
     * The new route will automatically show the corresponding page
     */
    _handleTabChange(value) {
        router.navigate(value);

        // Clear alert when this tab is selected
        if(value == 'alert') {
            AlertActions.alertViewed();
        }
    }

    /**
     * Return the selected tab according to the route name
     */
    _tabFromRouteName(name) {
        switch (name) {
            case 'alert':
                return 'alert';
            case 'home':
            case 'chat':
            case 'chat.channel':
                return 'home';
            case 'bars':
                return 'bars';
            case 'stock':
                return 'stock';
            case 'admin':
            case 'admin.teams':
            case 'admin.teams.id':
            case 'admin.barrels':
            case 'admin.alerts':
                return 'admin';
        }
    }

    render() {
        return (
            <div className="AdminPage" onClick={this._hideNotification}>
                <AdminTabs
                    onChange={this._handleTabChange}
                    value={this._tabFromRouteName(this.state.route.name)}
                />


                    {(() => {
                        let name = this.state.route.name;
                        switch(name) {

                            default:
                            case 'home':
                            case 'alert':
                            case 'chat':
                            case 'chat.channel':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                                            <AlertPage className={name != 'alert' ? 'AdminPage__splitscreen__secondary':''}/>
                                        }
                                        <ChatPage className={name != 'home' && name != 'chat' && name != 'chat.channel' ? 'AdminPage__splitscreen__secondary':''} route={this.state.route}/>
                                    </div>
                                );

                            case 'bars':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <BarPage />
                                    </div>
                                );

                            case 'stock':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <StockPage />
                                    </div>
                                );

                            case 'admin':
                            case 'admin.teams':
                            case 'admin.teams.id':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <TeamListPage
                                            route={this.state.route}
                                            className={name != 'admin.teams' && name != 'admin' ? 'AdminPage__splitscreen__secondary':''}
                                            />
                                        <TeamDetailsPage
                                            route={this.state.route}
                                            className={name != 'admin.teams.id' ? 'AdminPage__splitscreen__secondary':''}
                                            />
                                    </div>
                                );

                            case 'admin.barrels':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <BarrelsTypesPage />
                                    </div>
                                );

                            case 'admin.bottles':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <BottlesTypesPage />
                                    </div>
                                );

                            case 'admin.alerts':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <AlertButtonsPage />
                                    </div>
                                );
                        }
                    })()}
            </div>
        );
    }
}
