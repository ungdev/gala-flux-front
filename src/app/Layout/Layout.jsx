import React from 'react';

import AppBar from 'app/Layout/components/AppBar.jsx';
import MainTabs from 'app/Layout/components/MainTabs.jsx';
import FluxNotification from "app/Layout/components/FluxNotification.jsx";
import SnackbarNotification from "app/Layout/components/SnackbarNotification.jsx";

require('./Layout.scss');

/**
 * This component take car of loading each part of the layout
  * @param {Object} router react-router router object
 */
export default class Layout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mainClassName: '',
        };

        this.handleTabCountUpdate = this.handleTabCountUpdate.bind(this);
    }

    /**
     * This event is triggered when the number of tabs change (because of permissions for instance)
     * But if the number of tabs is <=1, the tabs will be hidden.
     * We have to inform css about this fact, so we assign thoses classes if tabs are hidden
     */
    handleTabCountUpdate(tabletCount, desktopCount) {
        let mainClassName = '';
        if(tabletCount <= 1) mainClassName += 'Layout__Main--tabletTabsHidden ';
        if(desktopCount <= 1) mainClassName += 'Layout__Main--desktopTabsHidden ';
        this.setState({mainClassName});
    }

    render() {
        return (
            <div className="Layout">
                <AppBar />
                <MainTabs router={this.props.router} onTabCountUpdate={this.handleTabCountUpdate}/>
                <main className={'Layout__Main '+this.state.mainClassName}>
                    {this.props.children}
                </main>
                <FluxNotification />
                <SnackbarNotification/>
            </div>
        );
    }
}
