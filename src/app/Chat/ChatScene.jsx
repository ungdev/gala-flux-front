import React from 'react';

import Form from 'app/Chat/components/Form.jsx';
import Messages from 'app/Chat/components/Messages.jsx';
import ChannelList from 'app/Chat/components/ChannelList.jsx';
import MenuContainer from 'app/Layout/components/MenuContainer.jsx';
import Page from 'app/components/Page.jsx';
import PagePart from 'app/components/PagePart.jsx';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    mainPannel: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
    },
    messages: {
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
    },
    form: {
        maxHeight: '48px',
        minHeight: '48px',
        height: '48px',
    },
    menu: {
        [theme.breakpoints.down('md')]: {
            width: '180px',
            maxWidth: '180px',
        },
        [theme.breakpoints.up('md')]: {
            width: '250px',
            maxWidth: '250px',
        },
    }
});

/**
 * This component will print thet chat page for the admin panel
 * @param {string} channel The channel selected or null
 * @param {bool} hideMenu If true, channel selector will not be shown
 * @param {Object} router react-router router object
 */
class ChatScene extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        let channel = null;
        // Set channel if we are on chat path
        if(this.props.router && this.props.router.routes.map(route => route.path).includes('/chat/**') && this.props.router.params.splat) {
            channel = this.props.router.params.splat;
        }

        return (
            <Page>
                <PagePart main={true} className={classes.mainPannel}>
                    <Messages channel={this.props.channel} />
                    <Form channel={this.props.channel} />
                </PagePart>
                {!this.props.hideMenu &&
                    <PagePart main={false} breakpoint="xs" className={classes.menu}>
                        <MenuContainer router={this.props.router}>
                            <ChannelList selectDefault={true}/>
                        </MenuContainer>
                    </PagePart>
                }
            </Page>
        );
    }
}
export default withStyles(styles)(ChatScene);
