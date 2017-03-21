import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";

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
                <hr/>
                <footer>
                    I am the Footer
                </footer>
            </div>
        );
    }

}