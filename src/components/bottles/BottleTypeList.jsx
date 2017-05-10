import React from 'react';

import BottleTypeStore from 'stores/BottleTypeStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions'

import SelectableList from 'components/partials/SelectableList.jsx'
import BottleTypeListItem from 'components/bottles/partials/BottleTypeListItem.jsx'
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import UpdateBottleTypeDialog from 'components/bottles/dialogs/UpdateBottleTypeDialog.jsx';
import NewBottleTypeDialog from 'components/bottles/dialogs/NewBottleTypeDialog.jsx';


/**
 * This component will show a clickable list of BottleTypes
 */
export default class BottleTypeList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bottleTypes: [],
            showUpdateBottleTypeDialog: false,
            showNewBottleTypeDialog: false,
            selectedType: null,
        };

        // binding
        this._toggleNewBottleTypeDialog = this._toggleNewBottleTypeDialog.bind(this);
        this._toggleUpdateBottleTypeDialog = this._toggleUpdateBottleTypeDialog.bind(this);
        this._loadData = this._loadData.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentDidMount() {
        // Load data from store
        this._loadData();

        // listen the stores changes
        BottleTypeStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // clear store
        BottleTypeStore.unloadData(this.BottleTypeStoreToken);

        // remove the stores listeners
        BottleTypeStore.removeChangeListener(this._updateData);
    }

    /**
     * Load data from all stores and update state
     */
    _loadData() {
        // Load data from store
        BottleTypeStore.loadData(null)
        .then(data => {
            // ensure that last token doen't exist anymore.
            BottleTypeStore.unloadData(this.BottleTypeStoreToken);

            // save the component token
            this.BottleTypeStoreToken = data.token;

            // Save the new state value
            this._updateData();

        })
        .catch(error => {
            NotificationActions.error("Une erreur s'est produite pendant le chargement de la liste des types de bouteilles", error);
        });
    }

    /**
     * Update data according to stores without adding new filter to it
     */
    _updateData() {
        this.setState({
            bottleTypes: BottleTypeStore.find()
        });
    }

    /**
     * Show or hide the create dialog
     */
    _toggleNewBottleTypeDialog() {
        this.setState({showNewBottleTypeDialog: !this.state.showNewBottleTypeDialog});
    }

    /**
     * Show or hide the update dialog
     * @param {BottleType} type selected type object
     */
    _toggleUpdateBottleTypeDialog(type) {
        if(AuthStore.can('bottleType/admin')) {
            this.setState({
                showUpdateBottleTypeDialog: (!this.state.showUpdateBottleTypeDialog && type != null),
                selectedType: type,
            });
        }
    }

    render() {
        return (
            <div className="FloatingButtonContainer">
                <div>
                    <h2 className="ListHeader">Types de bouteilles</h2>
                    <SelectableList value={this.state.selectedId}>
                        {
                            this.state.bottleTypes.map((type, i) => {
                                return  <BottleTypeListItem
                                        key={type.id}
                                        type={type}
                                        onSelection={_ => this._toggleUpdateBottleTypeDialog(type)}
                                    />
                            })
                        }
                    </SelectableList>
                </div>

                { AuthStore.can('bottleType/admin') &&
                    <FloatingActionButton
                        className="FloatingButton"
                        onTouchTap={this._toggleNewBottleTypeDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>
                }

                <NewBottleTypeDialog
                    show={this.state.showNewBottleTypeDialog}
                    close={this._toggleNewBottleTypeDialog}
                />

                <UpdateBottleTypeDialog
                    show={this.state.showUpdateBottleTypeDialog}
                    type={this.state.selectedType}
                    count={0}
                    close={this._toggleUpdateBottleTypeDialog}
                />
            </div>
        );


    }

}
