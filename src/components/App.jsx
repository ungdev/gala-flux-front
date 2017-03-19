import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";

export default class App extends React.Component {

    render() {
        return (
            <div>
                <header>
                    <h1>I am the Header</h1>
                    <AppNavbar />
                </header>
                <hr/>
                <main>
                    I am the content
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