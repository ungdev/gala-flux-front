import React from 'react';
import { routeNode } from 'react-router5';

import { Tabs, Tab } from 'material-ui/Tabs';

import AdminMenu from '../partials/AdminMenu.jsx';
import AuthStore from '../../stores/AuthStore.js';

import AlertPage from '../adminPages/AlertPage.jsx';
import ChatPage from '../adminPages/ChatPage.jsx';
import StockPage from '../adminPages/StockPage.jsx';
import BarPage from '../adminPages/BarPage.jsx';
import BarrelsTypesPage from '../adminPages/BarrelsTypesPage.jsx';
import AlertButtonsPage from '../adminPages/AlertButtonsPage.jsx';
import TeamListPage from '../adminPages/TeamListPage.jsx';
import TeamDetailsPage from '../adminPages/TeamDetailsPage.jsx';
import BottlesTypesPage from "../adminPages/BottlesTypesPage.jsx";

require('../../styles/homepages/AdminHomepage.scss');

class AdminHomepage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
        };
        this.router = props.router;

        // binding
        this._handleTabChange = this._handleTabChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    componentDidMount() {
        // Re-render every route change
        this.router.addListener(route => {
            this.setState({
                route: route,
            });
        });

        // Init route
        this.setState({
            route: this.props.route,
        });
    }


    /**
     * On tab change, navigate to new uri
     * The new route will automatically show the corresponding page
     */
    _handleTabChange(value) {
        this.router.navigate(value);
    }

    render() {
        return (
            <div className="AdminPage">
                <Tabs className="AdminPage__tabs" onChange={this._handleTabChange} value={this.state.route.name}>
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
                            case 'chat':
                            case 'chat.channel':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AlertPage className={name != 'home' ? 'AdminPage__splitscreen__secondary':''}/>
                                        <ChatPage className={name != 'chat' && name != 'chat.channel' ? 'AdminPage__splitscreen__secondary':''} route={this.state.route}/>
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
export default routeNode('')(AdminHomepage);
