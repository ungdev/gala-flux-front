import React from 'react';
import router from '../../router';

import AuthStore from '../../stores/AuthStore';
import ChatMenu from '../chat/ChatMenu.jsx'

import { ListItem } from 'material-ui/List';
import SelectableList from './SelectableList.jsx';

/**
 * This component will print a menu for the bar panel
 * @param {object} route The route state
 * @param {function(route)} onChange Function called when another item is selected with item value as paramater
 * in the drawer instead of the admin submenu
 */
export default class BarMenu extends React.Component {

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
                    <ListItem value="alert">Alertes</ListItem>
                    <ListItem value="stock">Gestion des stocks</ListItem>
                    <ListItem value="chat">Chat</ListItem>
                </SelectableList>
            </div>
        );
    }
}
