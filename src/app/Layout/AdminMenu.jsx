import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import ChannelList from 'app/Chat/components/ChannelList.jsx'

import MenuContainer from 'app/Layout/components/MenuContainer.jsx';
import SelectableListItem from 'app/components/SelectableListItem.jsx';

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
            messageCount: 0,
            hasMessage: false,
            alertCount: 0,
        };
    }

    render() {

        return (
            <MenuContainer router={this.props.router} >
                { ((AuthStore.can('team/read') || AuthStore.can('team/admin')) &&
                    (AuthStore.can('user/read') || AuthStore.can('user/team') || AuthStore.can('user/admin'))) &&
                    <SelectableListItem value="/admin/teams">Équipes et utilisateurs</SelectableListItem>
                }

                { (AuthStore.can('barrelType/admin') || AuthStore.can('barrel/restricted')
                    || AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                    <SelectableListItem value="/admin/barrels">Gestion des fûts</SelectableListItem>
                }

                { (AuthStore.can('barrelType/admin')) &&
                    <SelectableListItem value="/admin/bottles">Gestion des bouteilles</SelectableListItem>
                }

                { (AuthStore.can('alertButton/admin')) &&
                    <SelectableListItem value="/admin/alertbuttons">Gestion des boutons d'alerte</SelectableListItem>
                }

                { (AuthStore.can('developer/refresh')) &&
                    <SelectableListItem value="/admin/developer">Espace développeur</SelectableListItem>
                }
            </MenuContainer>
        );
    }
}
