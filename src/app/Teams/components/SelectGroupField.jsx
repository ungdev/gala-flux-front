import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import DataLoader from 'app/components/DataLoader.jsx';

import AutoComplete from 'material-ui/AutoComplete';

export default class SelectGroupField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            value: props.value,
        };

        // binding
        this._handleUpdateInput = this._handleUpdateInput.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    _handleUpdateInput(value) {
        this.props.onChange(value);
        this.setState({
            value: value,
        });
    }

    render() {
        return (
            <DataLoader
                filters={new Map([
                    ['Team', null],
                ])}
                onChange={ datastore => this.setState({
                    options: [...(new Set(datastore.Team.map(team => team.group)))],
                })}
            >
                { () => (
                    <AutoComplete
                        floatingLabelText="Groupe de discussion"
                        searchText={this.state.value}
                        onUpdateInput={this._handleUpdateInput}
                        dataSource={this.state.options}
                        filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                        openOnFocus={true}
                        maxSearchResults={5}
                        errorText={this.props.errorText}
                        fullWidth={this.props.fullWidth}
                        onNewRequest={(value, index) => {
                            // Only if enter is pressed
                            if(index == -1 && this.props.onSubmit) {
                                this.props.onSubmit();
                            }
                        }}
                    />
                )}
            </DataLoader>
        );
    }

}
