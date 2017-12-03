import React from 'react';

import AppBar from 'app/Layout/components/AppBar.jsx';
import MainTabs from 'app/Layout/components/MainTabs.jsx';
import FluxNotification from "app/Layout/components/FluxNotification.jsx";
import SnackbarNotification from "app/Layout/components/SnackbarNotification.jsx";
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        maxHeight: '100vh',
        overflow: 'hidden',
    },
    appBar: {
        [theme.breakpoints.down('sm')]: {
            height: theme.custom.appBarHeightXs,
            minHeight: theme.custom.appBarHeightXs,
        },
        [theme.breakpoints.up('md')]: {
            height: theme.custom.appBarHeightMd,
            minHeight: theme.custom.appBarHeightMd,
        },
    },
    tabs: {
        height: theme.custom.tabsHeight,
        minHeight: theme.custom.tabsHeight,
    },
    main: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
    },
});

/**
 * This component take car of loading each part of the layout
  * @param {Object} router react-router router object
 */
class Layout extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar router={this.props.router} className={classes.appBar}/>
                <MainTabs router={this.props.router} className={classes.tabs}/>
                <main className={classes.main}>
                    {this.props.children}
                </main>
                <FluxNotification />
                <SnackbarNotification/>
            </div>
        );
    }
}
export default withStyles(styles)(Layout);
