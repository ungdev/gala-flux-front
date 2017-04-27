import React from 'react';

import router from '../../router';

import muiThemeable from 'material-ui/styles/muiThemeable';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import AdminMenu from './AdminMenu.jsx';
import BarMenu from './BarMenu.jsx';
import AuthStore from '../../stores/AuthStore';

class MainDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            route: router.getState(),
        };

        this._palette = props.muiTheme.palette;

        // binding
        this._handleToggle = this._handleToggle.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    componentDidMount() {
        // Re-render every route change
        router.addListener((route) => {
            this.setState({
                route: route,
            });
        })

        // Init route
        this.setState({
            route: router.getState(),
        });
    }

    _handleToggle() {
        this.setState({open: !this.state.open});
    }

    _handleChange(route) {
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
                    {AuthStore.can('ui/admin') ?
                        <AdminMenu route={this.state.route} onChange={this._handleChange}/>
                        :
                        <BarMenu route={this.state.route} onChange={this._handleChange}/>
                    }
                </Drawer>
            </div>
        );
    }
}
export default muiThemeable()(MainDrawer);
