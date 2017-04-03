import React from 'react';

import { Tabs, Tab } from 'material-ui/Tabs';
import Dashboard from '../log/Dashboard.jsx';
require('../../styles/pages/LogPage.scss');

export default class LogPage extends React.Component {

    render() {
        return (
            <div className="hide-container">
                <Tabs
                    className="hide-container"
                >
                    <Tab
                        label="Dashboard"
                        className="hide-container"
                    >
                        <div className="hide-container">
                            <Dashboard />
                        </div>
                    </Tab>
                    <Tab
                        label="Bars"
                        className="hide-container"
                    >
                        <div className="hide-container">
                            <h2 className="headline">Bars</h2>
                        </div>
                    </Tab>
                    <Tab
                        label="Gestion du stock"
                        className="hide-container"
                    >
                        <div className="hide-container">
                            <h2 className="headline">Etat du stock</h2>
                        </div>
                    </Tab>
                    <Tab
                        label="Administration"
                        className="hide-container"
                    >
                        <div className="hide-container">
                            <h2 className="headline">Administration</h2>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
