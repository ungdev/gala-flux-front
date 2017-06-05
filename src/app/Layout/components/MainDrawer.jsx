import React from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
// import AdminMenu from 'components/partials/AdminMenu.jsx';
// import BarMenu from 'components/partials/BarMenu.jsx';
import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';

class MainDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            // route: router.getState(),
            team: AuthStore.team,
            overNewMessageCount: 0,
            underNewMessageCount: 0,
        };

        this._palette = props.muiTheme.palette;

        // binding
        this._handleScroll = this._handleScroll.bind(this);
        this._handleToggle = this._handleToggle.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleRouteChange = this._handleRouteChange.bind(this);
        this._handleAuthStoreChange = this._handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        // router.addListener(this._handleRouteChange);
        AuthStore.addChangeListener(this._handleAuthStoreChange);

        // Init route
        // this.setState({
        //     route: router.getState(),
        // });
    }

    componentWillUnmount() {
        // router.removeListener(this._handleRouteChange);
        AuthStore.removeChangeListener(this._handleAuthStoreChange);
    }

    componentDidUpdate() {
        this._handleScroll();
    }

    /**
     * Re-render when the route change
     * @param route
     */
    _handleRouteChange(route) {
        this.setState({
            route: route,
        });
    }

    _handleToggle() {
        this.setState({open: !this.state.open});
    }

    _handleChange(route) {
        this.setState({open: false});
    }

    _handleAuthStoreChange(route) {
        this.setState({team: AuthStore.team});
    }

    _handleScroll(e) {
        let target = this.scrollArea;
        if(target) {
            let over = 0;
            let under = 0;

            const scrollAreaTop = target.getBoundingClientRect().top;
            const scrollAreaBottom = target.getBoundingClientRect().bottom;

            // Calculate number of message under and over the view in the scroll area
            let elements = target.getElementsByClassName('NotificationScrollIndicatorLine');
            for (let i = 0 ; i < elements.length ; i++) {
                let el = elements[i];
                let rect = el.getBoundingClientRect();
                if(el.dataset && el.dataset.count && rect && rect.bottom != 0) {
                    if(rect.top - scrollAreaTop < 0) {
                        over += parseInt(el.dataset.count) || 0;
                    }
                    else if(scrollAreaBottom - rect.bottom < 0) {
                        under += parseInt(el.dataset.count) || 0;
                    }
                    if(el.dataset.count==24) {
                    }
                }
            }

            // update state if necessary
            let state = {};
            if(this.state.overNewMessageCount != over) {
                state.overNewMessageCount = over;
            }
            if(this.state.underNewMessageCount != under) {
                state.underNewMessageCount = under;
            }
            if(Object.keys(state) != 0) {
                this.setState(state);
            }
        }
    }

    render() {
        const style = {
            icon: {
                color: this._palette.alternateTextColor,
            }
        };

        // Don't draw anything if user is not logged in
        if(!this.state.team) {
            return null;
        }

        return (
            <div className="show-xs">
                <IconButton iconStyle={style.icon} onTouchTap={this._handleToggle}>
                    <NavigationMenu/>
                </IconButton>

                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    {this.state.overNewMessageCount != 0 &&
                        <div className="NotificationScrollIndicator--top">
                            <div>
                                {this.state.overNewMessageCount} Non lus ↑
                            </div>
                        </div>
                    }

                    <div style={{
                            height: '100%',
                            position: 'relative',
                            overflow: 'auto',
                        }}
                        onScroll={this._handleScroll}
                        ref={(el) => { this.scrollArea = el; }}
                    >
                        {/* AuthStore.can('ui/admin') ?
                            <AdminMenu route={this.state.route} onChange={this._handleChange}/>
                            :
                            <BarMenu route={this.state.route} onChange={this._handleChange}/>
                        */}
                    </div>


                    {this.state.underNewMessageCount != 0 &&
                        <div className="NotificationScrollIndicator--bottom">
                            <div>
                                {this.state.underNewMessageCount} Non lus ↓
                            </div>
                        </div>
                    }
                </Drawer>
            </div>
        );
    }
}
export default muiThemeable()(MainDrawer);
