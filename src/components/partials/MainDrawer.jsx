import React from 'react';
import { browserHistory } from 'react-router';

import muiThemeable from 'material-ui/styles/muiThemeable';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

class MainDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this._palette = props.muiTheme.palette;

        // binding
        this._handleToggle = this._handleToggle.bind(this);
    }

    _handleToggle() {
        this.setState({open: !this.state.open});
    }

    _handleClick(path) {
        browserHistory.push(path);
        this.setState({open: false});
    }

    render() {
        const style = {
            icon: {
                color: this._palette.alternateTextColor,
            }
        };

        return (
            <div>
                <IconButton iconStyle={style.icon} onTouchTap={this._handleToggle}>
                    <NavigationMenu/>
                </IconButton>

                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <MenuItem onTouchTap={_ => this._handleClick('/')}>home</MenuItem>
                    <MenuItem onTouchTap={_ => this._handleClick('/teams')}>Teams</MenuItem>
                    <MenuItem onTouchTap={_ => this._handleClick('/barrels')}>Barrels</MenuItem>
                </Drawer>
            </div>
        );
    }
}
export default muiThemeable()(MainDrawer);
