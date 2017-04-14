import React from 'react';
import { routeNode } from 'react-router5';

import { Tabs, Tab } from 'material-ui/Tabs';

import AdminMenu from '../partials/AdminMenu.jsx';

import AlertPage from '../adminPages/AlertPage.jsx';
import ChatPage from '../adminPages/ChatPage.jsx';
import BarrelsListPage from '../adminPages/BarrelsListPage.jsx';
import BarrelsTypesPage from '../adminPages/BarrelsTypesPage.jsx';
import AlertButtonsPage from '../adminPages/AlertButtonsPage.jsx';
import TeamListPage from '../adminPages/TeamListPage.jsx';
import TeamDetailsPage from '../adminPages/TeamDetailsPage.jsx';

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
        this.router.addListener((route) => {
            this.setState({
                route: route,
            });
        })

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
                    <Tab label="Gestion du stock" value="stock"/>
                    <Tab label="Administration" value="admin"/>
                </Tabs>
                    {(() => {
                        switch(this.state.route.name) {

                            default:
                            case 'home':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AlertPage />
                                        <ChatPage />
                                    </div>
                                );

                            case 'bars':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <h2 className="headline">Bars</h2>
                                    </div>
                                );

                            case 'stock':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <h2 className="headline">Etat du stock</h2>
                                    </div>
                                );

                            case 'admin':
                            case 'admin.teams':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <TeamListPage route={this.state.route} />
                                        <TeamDetailsPage route={this.state.route} />
                                    </div>
                                );

                            case 'admin.barrels':
                                return (
                                    <div className="AdminPage__splitscreen">
                                        <AdminMenu route={this.state.route} className="AdminPage__splitscreen__menu" />
                                        <BarrelsListPage />
                                        <BarrelsTypesPage />
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
