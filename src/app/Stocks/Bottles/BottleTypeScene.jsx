import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions'

import SelectableList from 'app/components/SelectableList.jsx'
import BottleTypeListItem from 'app/Stocks/Bottles/components/BottleTypeListItem.jsx'
import ContentAddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import UpdateBottleTypeDialog from 'app/Stocks/Bottles/dialogs/UpdateBottleTypeDialog.jsx';
import NewBottleTypeDialog from 'app/Stocks/Bottles/dialogs/NewBottleTypeDialog.jsx';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * This component will show a clickable list of BottleTypes
 */
export default class BottleTypeScene extends React.Component {

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
                <DataLoader
                    filters={new Map([
                        ['BottleType', null],
                        ['Barrel', null],
                    ])}
                    onChange={ datastore => this.setState({
                        bottleTypes: datastore.BottleType.sortBy('name'),
                    })}
                >
                    { () => (
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
                                <Button
                                    fab
                                    className="FloatingButton"
                                    onTouchTap={this._toggleNewBottleTypeDialog}
                                >
                                    <ContentAddIcon />
                                </Button>
                            }

                            <NewBottleTypeDialog
                                show={this.state.showNewBottleTypeDialog}
                                close={this._toggleNewBottleTypeDialog}
                            />

                            { this.state.selectedType &&
                            <UpdateBottleTypeDialog
                                show={this.state.showUpdateBottleTypeDialog}
                                type={this.state.selectedType}
                                count={0}
                                close={this._toggleUpdateBottleTypeDialog}
                            /> }
                        </div>
                    )}
                </DataLoader>
            </div>
        );


    }

}
