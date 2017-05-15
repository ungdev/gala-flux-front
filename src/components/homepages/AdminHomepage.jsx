import React from 'react';
import router from 'router';

import { Tabs, Tab } from 'material-ui/Tabs';

import AdminMenu from 'components/partials/AdminMenu.jsx';
import AuthStore from 'stores/AuthStore';
import ChatStore from 'stores/ChatStore';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';

import FluxNotification from 'components/partials/FluxNotification.jsx';
import AlertPage from 'components/adminPages/AlertPage.jsx';
import ChatPage from 'components/adminPages/ChatPage.jsx';
import StockPage from 'components/adminPages/StockPage.jsx';
import BarHome from 'components/adminPages/BarHome.jsx';
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
            notify: null
        };

        // binding
        this._handleTabChange = this._handleTabChange.bind(this);
        this._showNotification = this._showNotification.bind(this);
        this._hideNotification = this._hideNotification.bind(this);
    }

    componentDidMount() {
        // Listen new messages events
        ChatStore.addNewListener(this._showNotification);
    }

    componentWillUnmount() {
        // remove the store listener
        ChatStore.removeNewListener(this._showNotification);
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

    _showNotification(message) {
        if (!this.state.notify) {
            let user = UserStore.findById(message.sender);
            let team = user ? TeamStore.findById(user.team) : null;
            let contentPrefix = (user? user.name + (team?' ('+team.name+')':'') + ' : ' : '');
            this.setState({ notify: { title: 'Nouveau message sur ' + message.channel.split(':')[1], content: contentPrefix + message.text }});
        }
    }

    _hideNotification() {
        if (this.state.notify) {
            this.setState({ notify: false });
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

                {/* Tabs for tablet */}
                <Tabs className="AdminPage__tabs show-sm" onChange={this._handleTabChange} value={this._tabFromRouteName(this.state.route.name)}>
                    <Tab label="Chat" value="home"/>
                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                        <Tab label="Alertes" value="alert"/>
                    }

                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                    (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Bars" value="bars"/>
                    }

                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Gestion du stock" value="stock"/>
                    }
                    <Tab label="Administration" value="admin"/>
                </Tabs>

                {/* Tabs for desktop */}
                <Tabs className="AdminPage__tabs hide-sm" onChange={this._handleTabChange} value={this._tabFromRouteName(this.state.route.name)}>
                    <Tab label="Dashboard" value="home"/>
                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                    (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Bars" value="bars"/>
                    }
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

                            case 'barhome.id':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <BarHome barId={this.state.route.params.id}/>
                                    </div>
                                );
                        }
                    })()}


                {
                    this.state.notify &&
                    <FluxNotification title={this.state.notify.title} content={this.state.notify.content} />
                }
            </div>
        );
    }
}
