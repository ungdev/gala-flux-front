import React from 'react';

import BarrelStore from 'stores/BarrelStore';
import BarrelTypeStore from 'stores/BarrelTypeStore';
import AuthStore from 'stores/AuthStore';
import NotificationActions from 'actions/NotificationActions'

import SelectableList from 'app/components/SelectableList.jsx'
import BarrelTypeListItem from 'app/Stocks/Barrels/components/BarrelTypeListItem.jsx'
import ContentAddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import UpdateBarrelTypeDialog from 'app/Stocks/Barrels/dialogs/UpdateBarrelTypeDialog.jsx';
import NewBarrelTypeDialog from 'app/Stocks/Barrels/dialogs/NewBarrelTypeDialog.jsx';
import DataLoader from "app/components/DataLoader.jsx";


/**
 * This component will show a clickable list of BarrelTypes
 */
export default class BarrelTypeScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrelTypes: null,
            barrels: null,
            showUpdateBarrelTypeDialog: false,
            showNewBarrelTypeDialog: false,
            selectedType: null,
        };

        // binding
        this.toggleNewBarrelTypeDialog = this.toggleNewBarrelTypeDialog.bind(this);
        this.toggleUpdateBarrelTypeDialog = this.toggleUpdateBarrelTypeDialog.bind(this);
    }

    /**
     * Show or hide the create dialog
     */
    toggleNewBarrelTypeDialog() {
        this.setState({showNewBarrelTypeDialog: !this.state.showNewBarrelTypeDialog});
    }

    /**
     * Show or hide the update dialog
     * @param {BarrelType} type selected type object
     */
    toggleUpdateBarrelTypeDialog(type) {
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
                <DataLoader
                    filters={new Map([
                        ['BarrelType', null],
                        ['Barrel', null],
                    ])}
                    onChange={ datastore => this.setState({
                        barrelTypes: datastore.BarrelType.sortBy('name'),
                        barrels: datastore.Barrel.groupBy('typeId'),
                    })}
                >
                    { () => (
                        <div className="FloatingButtonContainer">
                            <div>
                                <h2 className="ListHeader">Types de fûts</h2>
                                <SelectableList value={this.state.selectedId}>
                                    {
                                        this.state.barrelTypes.map((type) => {
                                            return  <BarrelTypeListItem
                                                    key={type.id}
                                                    type={type}
                                                    count={this.state.barrels[type.id] ? this.state.barrels[type.id].length : 0}
                                                    onSelection={_ => this.toggleUpdateBarrelTypeDialog(type)}
                                                />
                                        })
                                    }
                                </SelectableList>
                            </div>

                            { AuthStore.can('barrelType/admin') &&
                                <Button
                                    color="primary"
                                    fab
                                    className="FloatingButton"
                                    onTouchTap={this.toggleNewBarrelTypeDialog}
                                >
                                    <ContentAddIcon />
                                </Button>
                            }

                            <NewBarrelTypeDialog
                                show={this.state.showNewBarrelTypeDialog}
                                close={this.toggleNewBarrelTypeDialog}
                            />

                            { this.state.selectedType &&
                                <UpdateBarrelTypeDialog
                                    show={this.state.showUpdateBarrelTypeDialog}
                                    type={this.state.selectedType}
                                    count={this.state.barrels[this.state.selectedType.id] ? this.state.barrels[this.state.selectedType.id].length : 0}
                                    close={this.toggleUpdateBarrelTypeDialog}
                                />
                            }
                        </div>
                    )}
                </DataLoader>
            </div>
        );


    }

}
