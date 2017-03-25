import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";
import AppFooter from "./partials/AppFooter.jsx";

export default class App extends React.Component {

    render() {
        const style = {
            main: {
                marginTop: 64
            }
        };

        return (
            <div>
                <AppNavbar />
                <main style={style.main}>
                    {this.props.children}
                </main>
                <AppFooter />
            </div>
        );
    }

}