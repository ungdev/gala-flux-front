import React from 'react';
import router from '../../router';

import AuthStore from '../../stores/AuthStore';
import ChatMenu from '../chat/ChatMenu.jsx'

import { ListItem } from 'material-ui/List';
import SelectableList from './SelectableList.jsx';

require('../../styles/partials/AdminMenu.scss');

/**
 * This component will print a menu for the admin panel
 * @param {object} route The route state
 * @param {function(route)} onChange Function called when another item is selected with item value as paramater
 * in the drawer instead of the admin submenu
 */
export default class AdminMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    _handleChange(route) {
        router.navigate(route);

        if(this.props.onChange) {
            this.props.onChange(route);
        }
    }

    render() {

        return (
            <div className={this.props.className}>
                <SelectableList onChange={this._handleChange} value={this.state.route.name} className="AdminMenu">

                    <ListItem value="home" className="AdminMenu__mainItem">Dashboard</ListItem>
                    <ListItem value="chat" className="AdminMenu__mainItem AdminMenu__show-xs">Chat</ListItem>
                    <div className="AdminMenu__show-xs">
                        <ChatMenu route={this.state.route} onChange={(channel) => this.props.onChange('chat.channel', {channel: channel})} />
                    </div>

                    <ListItem value="bars" className="AdminMenu__mainItem">Bars</ListItem>

                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <ListItem value="stock" className="AdminMenu__mainItem">Stocks</ListItem>
                    }
                    <ListItem value="admin" className="AdminMenu__mainItem">Administration</ListItem>


                    { ((AuthStore.can('team/read') || AuthStore.can('team/admin')) &&
                        (AuthStore.can('user/read') || AuthStore.can('user/team') || AuthStore.can('user/admin'))) &&
                        <ListItem value="admin.teams" className="AdminMenu__item">Équipes et utilisateurs</ListItem>
                    }

                    { (AuthStore.can('barrelType/admin') || AuthStore.can('barrel/restricted')
                        || AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <ListItem value="admin.barrels" className="AdminMenu__item">Gestion des fûts</ListItem>
                    }

                    { (AuthStore.can('bottleType/admin')) &&
                        <ListItem value="admin.bottles" className="AdminMenu__item">Gestion des bouteilles</ListItem>
                    }
                    <ListItem value="admin.alerts" className="AdminMenu__item">Gestion des boutons d'alerte</ListItem>
                </SelectableList>
            </div>
        );
    }
}
