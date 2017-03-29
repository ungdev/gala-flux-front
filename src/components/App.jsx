import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";
import AppFooter from "./partials/AppFooter.jsx";

export default class App extends React.Component {

    render() {
        const style = {
            main: {
                position: 'fixed',
                top: '64px',
                bottom: '0px',
                width: '100%',
                overflow: 'auto',
            },
        };

        return (
            <div className="hideContainer">
                <AppNavbar />
                <main style={style.main}>
                    {this.props.children}
                </main>
                <AppFooter />
            </div>
        );
    }

}
