import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import DataLoader from 'app/components/DataLoader.jsx';

import AutoComplete from 'app/components/AutoComplete.jsx';

export default class SelectGroupField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
        };
    }

    render() {
        let {...props} = this.props;

        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                ])}
                onChange={ datastore => {
                    let suggestions = datastore.Team.map(team => team.group);

                    // Make them unique
                    suggestions = [...(new Set(suggestions))];

                    // Remove empty entries
                    suggestions = suggestions.filter(v => (v != undefined));

                    // Put them in the good format
                    suggestions = suggestions.map(label => ({label: label}));

                    this.setState({
                        options: suggestions
                    })
                }}
            >
                {() => {

                    return (<AutoComplete
                        {...props}
                        openOnFocus={true}
                        maxSearchResults={5}
                        suggestions={this.state.options}
                    />

                )}}
            </DataLoader>
        );
    }

}
