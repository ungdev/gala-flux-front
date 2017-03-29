import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

export default class SelectGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // TODO get from TeamStore
            options: [
                "bar",
                "admin",
                "log",
                "orga"
            ],
            value: props.value,
        }

        // binding
        this._handleUpdateInput = this._handleUpdateInput.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    _handleUpdateInput(value) {
        console.log(this.state.value);
        this.props.onChange(value);
        this.setState({
            value: value,
        });
    }

    render() {
        return (
            <AutoComplete
                floatingLabelText="Groupe de discussion"
                searchText={this.state.value}
                onUpdateInput={this._handleUpdateInput}
                dataSource={this.state.options}
                filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                openOnFocus={true}
            />
        );
    }

}
