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
        [theme.breakpoints.up('md')]: {
            height: theme.custom.appBarHeightMd,
        },
    },
    toolbar: {
        [theme.breakpoints.down('sm')]: {
            minHeight: theme.custom.appBarHeightXs,
        },
        [theme.breakpoints.up('md')]: {
            minHeight: theme.custom.appBarHeightMd,
        },
    },
    title: {
        flex: 'auto',
    }
});

/**
 * This is the top bar shown on every pages of the layout
 * @param {Object} router react-router router object
 */
class AppBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Flux',
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <MaterialAppBar
                className={classes.root}
                position="static"
            >
                <Toolbar className={classes.toolbar}>
                    <MainDrawer router={this.props.router}/>
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
