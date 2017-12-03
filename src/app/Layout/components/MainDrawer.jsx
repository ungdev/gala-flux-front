import React from 'react';

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import NavigationMenu from 'material-ui-icons/Menu';
import ChannelList from 'app/Chat/components/ChannelList.jsx';
import MenuContainer from 'app/Layout/components/MenuContainer.jsx';
import MainMenu from 'app/Layout/components/MainMenu.jsx';
import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';

/**
 * Main application drawer shown only on small screen
 * @param {Object} router react-router router object
 */
export default class MainDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            overNewMessageCount: 0,
            underNewMessageCount: 0,
            user: AuthStore.user,
        };

        // binding
        this.handleScroll = this.handleScroll.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleCloseRequest = this.handleCloseRequest.bind(this);
        this.onAuthStoreChange = this.onAuthStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the store change
        AuthStore.addChangeListener(this.onAuthStoreChange);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.onAuthStoreChange);
    }

    /**
     * When there is a change in the AuthStore, update the value of user in the component state
     */
    onAuthStoreChange() {
        this.setState({
            user: AuthStore.user,
        });
    }

    componentDidUpdate() {
        this.handleScroll();
    }

    handleToggle() {
        this.setState({
            open: !this.state.open,
        });
    }

    handleCloseRequest() {
        this.setState({
            open: false,
        });
    }

    handleScroll(e) {
        // let target = this.scrollArea;
        // if(target) {
        //     let over = 0;
        //     let under = 0;
        //
        //     const scrollAreaTop = target.getBoundingClientRect().top;
        //     const scrollAreaBottom = target.getBoundingClientRect().bottom;
        //
        //     // Calculate number of message under and over the view in the scroll area
        //     let elements = target.getElementsByClassName('NotificationScrollIndicatorLine');
        //     for (let i = 0 ; i < elements.length ; i++) {
        //         let el = elements[i];
        //         let rect = el.getBoundingClientRect();
        //         if(el.dataset && el.dataset.count && rect && rect.bottom != 0) {
        //             if(rect.top - scrollAreaTop < 0) {
        //                 over += parseInt(el.dataset.count) || 0;
        //             }
        //             else if(scrollAreaBottom - rect.bottom < 0) {
        //                 under += parseInt(el.dataset.count) || 0;
        //             }
        //             if(el.dataset.count==24) {
        //             }
        //         }
        //     }
        //
        //     // update state if necessary
        //     let state = {};
        //     if(this.state.overNewMessageCount != over) {
        //         state.overNewMessageCount = over;
        //     }
        //     if(this.state.underNewMessageCount != under) {
        //         state.underNewMessageCount = under;
        //     }
        //     if(Object.keys(state) != 0) {
        //         this.setState(state);
        //     }
        // }
    }


                        // <div style={{
                        //         height: '100%',
                        //         position: 'relative',
                        //         overflow: 'auto',
                        //     }}
                        //     onScroll={this.handleScroll}
                        //     ref={(el) => { this.scrollArea = el; }}
                        // >

    render() {
        if(!this.state.user) {
            return null;
        }

        return (
            <div>
                <IconButton onTouchTap={this.handleToggle} color="contrast" className="show-xs">
                    <NavigationMenu/>
                </IconButton>

                <Drawer
                    anchor="left"
                    open={this.state.open}
                    onRequestClose={this.handleCloseRequest}
                >
                    <MenuContainer router={this.props.router} onChange={this.handleCloseRequest}>
                        <MainMenu />
                        <Divider />
                        <ChannelList />
                    </MenuContainer>
                </Drawer>
            </div>
        );
    }
}
