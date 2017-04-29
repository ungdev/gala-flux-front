import React from 'react';

import BarrelStore from '../../stores/BarrelStore';
import BarrelTypeStore from '../../stores/BarrelTypeStore';
import AuthStore from '../../stores/AuthStore';
import NotificationActions from '../../actions/NotificationActions'

import SelectableList from '../partials/SelectableList.jsx'
import BarrelTypeListItem from './partials/BarrelTypeListItem.jsx'
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import UpdateBarrelTypeDialog from './dialogs/UpdateBarrelTypeDialog.jsx';
import NewBarrelTypeDialog from './dialogs/NewBarrelTypeDialog.jsx';


/**
 * This component will show a clickable list of BarrelTypes
 */
export default class BarrelTypeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrelTypes: [],
            counts: {},
            showUpdateBarrelTypeDialog: false,
            showNewBarrelTypeDialog: false,
            selectedType: null,
        };

        // binding
        this._toggleNewBarrelTypeDialog = this._toggleNewBarrelTypeDialog.bind(this);
        this._toggleUpdateBarrelTypeDialog = this._toggleUpdateBarrelTypeDialog.bind(this);
        this._loadData = this._loadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentDidMount() {
        // Load data from store
        this._loadData();

        // listen the stores changes
        BarrelStore.addChangeListener(this._updateData);
        BarrelTypeStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear store
        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);

        // remove the stores listeners
        BarrelStore.removeChangeListener(this._updateData);
        BarrelTypeStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     */
    _loadData() {
        // Load data from store
        BarrelTypeStore.loadData(null)
        .then(data => {
            // ensure that last token doen't exist anymore.
            BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);

            // save the component token
            this.BarrelTypeStoreToken = data.token;

            // Load Barrel counts per types
            return BarrelStore.loadData(null);
        })
        .then(data => {
            // ensure that last token doen't exist anymore.
            BarrelStore.unloadData(this.BarrelStoreToken);

            // save the component token
            this.BarrelStoreToken = data.token;

            // Save the new state value
            this._updateData();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des types de fûts', error);
        });
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        let counts = {};
        for (let barrel of BarrelStore.find()) {
            if(!counts[barrel.type]) {
                counts[barrel.type] = 0;
            }
            counts[barrel.type]++;
        }

        this.setState({
            barrelTypes: BarrelTypeStore.find(),
            counts: counts,
        });
    }

    /**
     * Show or hide the create dialog
     */
    _toggleNewBarrelTypeDialog() {
        this.setState({showNewBarrelTypeDialog: !this.state.showNewBarrelTypeDialog});
    }

    /**
     * Show or hide the update dialog
     * @param {BarrelType} type selected type object
     */
    _toggleUpdateBarrelTypeDialog(type) {
        if(AuthStore.can('barrelType/admin')) {
            this.setState({
                showUpdateBarrelTypeDialog: (!this.state.showUpdateBarrelTypeDialog && type != null),
                selectedType: type,
            });
        }
    }

    render() {
        return (
            <div className="FloatingButtonContainer">
                <div>
                    <h2 className="ListHeader">Types de fûts</h2>
                    <SelectableList value={this.state.selectedId}>
                        {
                            this.state.barrelTypes.map((type, i) => {
                                return  <BarrelTypeListItem
                                        key={type.id}
                                        type={type}
                                        count={this.state.counts[type.id]}
                                        onSelection={_ => this._toggleUpdateBarrelTypeDialog(type)}
                                    />
                            })
                        }
                    </SelectableList>
                </div>

                { AuthStore.can('barrelType/admin') &&
                    <FloatingActionButton
                        className="FloatingButton"
                        onTouchTap={this._toggleNewBarrelTypeDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>
                }

                <NewBarrelTypeDialog
                    show={this.state.showNewBarrelTypeDialog}
                    close={this._toggleNewBarrelTypeDialog}
                />

                <UpdateBarrelTypeDialog
                    show={this.state.showUpdateBarrelTypeDialog}
                    type={this.state.selectedType}
                    count={
                        (this.state.selectedType && this.state.counts[this.state.selectedType.id])
                        ? this.state.counts[this.state.selectedType.id]
                        : 0
                    }
                    close={this._toggleUpdateBarrelTypeDialog}
                />
            </div>
        );


    }

}
