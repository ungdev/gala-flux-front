import React from 'react';
import { routeNode } from 'react-router5';

import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import SelectableList from '../partials/SelectableList.jsx';


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
            tab: null,
            subtab: null,
            route: props.route,
        };
        this.router = props.router;

        // binding
        this._handleTabChange = this._handleTabChange.bind(this);
        this._handleSubtabChange = this._handleSubtabChange.bind(this);
        this._handeRouteUpdate = this._handeRouteUpdate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this._handeRouteUpdate(nextProps.route);
    }

    componentDidMount() {
        this.router.addListener((route) => {
            this._handeRouteUpdate(route);
        })
        this._handeRouteUpdate(this.props.route)
    }

    _handeRouteUpdate(route) {
        let routeArray = route.name.split('.');
        this.setState({
            tab: routeArray[0],
            subtab: routeArray[1],
            route: route,
        });
    }

    _handleTabChange(value) {
        this.router.navigate(value);
        this.setState({tab: value});
    }

    _handleSubtabChange(value) {
        this.router.navigate('admin.' + value);
        this.setState({subtab: value});
    }

    render() {
        return (
            <Tabs contentContainerClassName="AdminPage__content" onChange={this._handleTabChange} value={this.state.tab}>
                <Tab label="Dashboard" value="home">
                    {this.state.tab == 'home' &&
                        <div className="AdminPage__splitscreen">
                            <AlertPage />
                            <ChatPage />
                        </div>
                    }
                </Tab>
                <Tab label="Bars" value="bars">
                    {this.state.tab == 'bars' &&
                        <h2 className="headline">Bars</h2>
                    }
                </Tab>
                <Tab label="Gestion du stock" value="stock">
                    {this.state.tab == 'stock' &&
                        <h2 className="headline">Etat du stock</h2>
                    }
                </Tab>
                <Tab label="Administration" value="admin">
                    {(() => {
                        if(this.state.tab == 'admin') {

                            let menu = (<div className="AdminPage__splitscreen__menu">
                                <SelectableList onChange={this._handleSubtabChange} value={this.state.subtab}>
                                    <ListItem value="teams">Équipes et utilisateurs</ListItem>
                                    <ListItem value="barrels">Gestion des fûts</ListItem>
                                    <ListItem value="alerts">Gestion des boutons d'alerte</ListItem>
                                </SelectableList>
                            </div>);

                            switch (this.state.subtab) {
                                case 'teams':
                                    return (
                                        <div className="AdminPage__splitscreen">
                                            {menu}
                                            <TeamListPage route={this.state.route} />
                                            <TeamDetailsPage route={this.state.route} />
                                        </div>
                                    );
                                case 'barrels':
                                    return (
                                        <div className="AdminPage__splitscreen">
                                            {menu}
                                            <BarrelsListPage />
                                            <BarrelsTypesPage />
                                        </div>
                                    );
                                case 'alerts':
                                    return (
                                        <div className="AdminPage__splitscreen">
                                            {menu}
                                            <AlertButtonsPage />
                                        </div>
                                    );
                                default:
                                    return (
                                        <div className="AdminPage__splitscreen">
                                            {menu}
                                            <div></div>
                                        </div>
                                    );
                            }
                        }
                    })()}
                </Tab>
            </Tabs>
        );
    }
}
export default routeNode('')(AdminHomepage);
