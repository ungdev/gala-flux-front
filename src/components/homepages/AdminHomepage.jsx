import React from 'react';
import router from '../../router';

import { Tabs, Tab } from 'material-ui/Tabs';

import AdminMenu from '../partials/AdminMenu.jsx';
import AuthStore from '../../stores/AuthStore';
import ChatStore from '../../stores/ChatStore';

import AlertPage from '../adminPages/AlertPage.jsx';
import ChatPage from '../adminPages/ChatPage.jsx';
import StockPage from '../adminPages/StockPage.jsx';
import BarPage from '../adminPages/BarPage.jsx';
import BarrelsTypesPage from '../adminPages/BarrelsTypesPage.jsx';
import BottlesTypesPage from "../adminPages/BottlesTypesPage.jsx";
import AlertButtonsPage from '../adminPages/AlertButtonsPage.jsx';
import TeamListPage from '../adminPages/TeamListPage.jsx';
import TeamDetailsPage from '../adminPages/TeamDetailsPage.jsx';


require('../../styles/homepages/AdminHomepage.scss');
require('../../styles/FlashScreen.scss');


/**
 * @param {Object} route Route object given by the router
 */
export default class AdminHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
            flashScreen: true
        };

        // binding
        this._handleTabChange = this._handleTabChange.bind(this);
        this._hideFlashScreen = this._hideFlashScreen.bind(this);
        this._flashScreen = this._flashScreen.bind(this);
    }

    componentDidMount() {
        // Listen new messages events
        ChatStore.addNewListener(this._flashScreen);
    }

    componentWillUnmount() {
        // remove the store listener
        ChatStore.removeNewListener(this._flashScreen);
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
    }

    _flashScreen() {
        this.setState({ flashScreen: true });
    }

    _hideFlashScreen() {
        if (this.state.flashScreen) {
            this.setState({ flashScreen: false });
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
            <div className="AdminPage">

                {/* Tabs for tablet */}
                <Tabs className="AdminPage__tabs show-sm" onChange={this._handleTabChange} value={this._tabFromRouteName(this.state.route.name)}>
                    <Tab label="Chat" value="home"/>
                    <Tab label="Alertes" value="alert"/>
                    <Tab label="Bars" value="bars"/>
                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Gestion du stock" value="stock"/>
                    }
                    <Tab label="Administration" value="admin"/>
                </Tabs>

                {/* Tabs for desktop */}
                <Tabs className="AdminPage__tabs hide-sm" onChange={this._handleTabChange} value={this._tabFromRouteName(this.state.route.name)}>
                    <Tab label="Dashboard" value="home"/>
                    <Tab label="Bars" value="bars"/>
                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Gestion du stock" value="stock"/>
                    }
                    <Tab label="Administration" value="admin"/>
                </Tabs>


                    {(() => {
                        let name = this.state.route.name;
                        switch(name) {

                            default:
                            case 'home':
                            case 'alert':
                            case 'chat':
                            case 'chat.channel':
                                return (
                                    <div className="AdminPage__splitscreen" onClick={this._hideFlashScreen}>
                                        <AlertPage className={name != 'alert' ? 'AdminPage__splitscreen__secondary':''}/>
                                        <ChatPage className={name != 'home' && name != 'chat' && name != 'chat.channel' ? 'AdminPage__splitscreen__secondary':''} route={this.state.route}/>
                                        {
                                             this.state.flashScreen &&
                                             <div className="flash_screen"></div>
                                         }
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
