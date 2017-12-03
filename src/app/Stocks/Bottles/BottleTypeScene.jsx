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
        this.toggleNewBottleTypeDialog = this.toggleNewBottleTypeDialog.bind(this);
        this.toggleUpdateBottleTypeDialog = this.toggleUpdateBottleTypeDialog.bind(this);
    }


    /**
     * Show or hide the create dialog
     */
    toggleNewBottleTypeDialog() {
        this.setState({showNewBottleTypeDialog: !this.state.showNewBottleTypeDialog});
    }

    /**
     * Show or hide the update dialog
     * @param {BottleType} type selected type object
     */
    toggleUpdateBottleTypeDialog(type) {
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
                                        this.state.bottleTypes.map((type) => {
                                            return  <BottleTypeListItem
                                                    key={type.id}
                                                    type={type}
                                                    onSelection={_ => this.toggleUpdateBottleTypeDialog(type)}
                                                />
                                        })
                                    }
                                </SelectableList>
                            </div>

                            { AuthStore.can('bottleType/admin') &&
                                <Button
                                    fab
                                    className="FloatingButton"
                                    color="primary"
                                    onTouchTap={this.toggleNewBottleTypeDialog}
                                >
                                    <ContentAddIcon />
                                </Button>
                            }

                            <NewBottleTypeDialog
                                show={this.state.showNewBottleTypeDialog}
                                close={this.toggleNewBottleTypeDialog}
                            />

                            { this.state.selectedType &&
                            <UpdateBottleTypeDialog
                                show={this.state.showUpdateBottleTypeDialog}
                                type={this.state.selectedType}
                                count={0}
                                close={this.toggleUpdateBottleTypeDialog}
                            /> }
                        </div>
                    )}
                </DataLoader>
            </div>
        );


    }

}
