import React from 'react';

import MaterialAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import MainDrawer from 'app/Layout/components/MainDrawer.jsx';
import AuthMenu from 'app/Layout/components/AuthMenu.jsx';


const styles = theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            height: theme.custom.appBarHeightXs,
        },
    },
    toolbar: {
        [theme.breakpoints.down('sm')]: {
            minHeight: theme.custom.appBarHeightXs,
        },
    },
    title: {
        flex: 'auto',
    }
});

/**
 * This is the top bar shown on every pages of the layout
 */
class AppBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Flux',
        };

        // this._handleRouteUpdate = this._handleRouteUpdate.bind(this);
    }

    // componentDidMount() {
    //     // Re-render every route change
    //     router.addListener((route) => {
    //         this._handleRouteUpdate(route);
    //     });
    //
    //     // Init route
    //     this._handleRouteUpdate(router.getState());
    // }

    // _handleRouteUpdate(route) {
    //     for (let routeConf of routes) {
    //         if(routeConf.name === route.name && routeConf.title) {
    //             let title = routeConf.title;
    //             if(typeof routeConf.title === 'function') {
    //                 title = routeConf.title(route);
    //             }
    //             this.setState({title: title});
    //             return;
    //         }
    //     }
    //     this.setState({title: 'Flux'});
    // }

    render() {
        const { classes } = this.props;
        return (
            <MaterialAppBar
                className={classes.root}
                position="static"
            >
                <Toolbar className={classes.toolbar}>
                    <MainDrawer />
                    <Typography type="title" color="inherit" className={classes.title} component="h1">
                        {this.state.title}
                    </Typography>
                    <AuthMenu />
                </Toolbar>
            </MaterialAppBar>
        );
    }
}

export default withStyles(styles)(AppBar);
