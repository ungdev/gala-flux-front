import React from 'react';

import { withStyles } from 'material-ui/styles';
import AdminMenu from 'app/Layout/AdminMenu.jsx';
import Page from 'app/components/Page.jsx';
import PagePart from 'app/components/PagePart.jsx';
import PagePartSeparator from 'app/components/PagePartSeparator.jsx';


const styles = theme => ({
    menu: {
        [theme.breakpoints.up('sm')]: {
            maxWidth: '250px',
        },
    }
});

class AdminPage extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Page>
                <PagePart main={this.props.router.getCurrentLocation().pathname == '/admin'} className={classes.menu} breakpoint="xs">
                    <AdminMenu router={this.props.router} />
                </PagePart>
                <PagePartSeparator main={false} breakpoint="xs"/>
                <PagePart main={this.props.router.getCurrentLocation().pathname != '/admin'} breakpoint="xs">
                    {this.props.children}
                </PagePart>
            </Page>
        );
    }
}
export default withStyles(styles)(AdminPage);
