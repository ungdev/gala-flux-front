import React from 'react';

import NotificationActions from '../../../actions/NotificationActions';
import TeamStore from '../../../stores/TeamStore';

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
        this._loadData = this._loadData.bind(this);
        this._unloadData = this._unloadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }


    componentDidMount() {
        // Load data from store
        this._loadData();

        // listen the stores changes
        TeamStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear store
        this._unloadData();

        // remove the stores listeners
        TeamStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     */
    _loadData() {
        // Load team in store
        TeamStore.loadData(null)
        .then(data => {
            // save the component token
            this.TeamStoreToken = data.token;

            // Save the new state value
            this._updateData();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des groupes de discussion', error);
        });
    }

    /**
     * clear stores
     */
    _unloadData() {
        TeamStore.unloadData(this.TeamStoreToken);
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        this.setState({
            options: TeamStore.groups,
        });
    }

    _handleUpdateInput(value) {
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
        );
    }

}
