import React from 'react';

import Layout from 'material-ui/Layout';
import TeamsList from '../teams/TeamList.jsx';
import TeamDetails from '../teams/TeamDetails.jsx';

export default class TeamsPage extends React.Component {

    render() {
        return (
            <div>
                <Layout container gutter={24}>
                    <Layout item xs={12} sm={4} md={6}>
                        <TeamsList />
                    </Layout>
                    <Layout item xs={12} sm={8} md={6}>
                        <TeamDetails />
                    </Layout>
                </Layout>
            </div>
        );
    }

}