import React from 'react';

import BarrelTypeStore from '../../stores/BarrelTypeStore';

import { List } from 'material-ui/List';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import BarrelType from './BarrelType.jsx';
import ShowBarrelType from './ShowBarrelType.jsx';
import EditBarrelType from './EditBarrelType.jsx';
import NewBarrelType from './NewBarrelType.jsx';

export default class TypesList extends React.Component {

    constructor() {
        super();

        this.state = {
            types: [],
            selected: null,
            openNewDialog: false,
            openShowDialog: false,
            openEditDialog: false,
        };

        this.BarrelTypeStoreToken = null;

        // bindings
        this._setBarrelTypes = this._setBarrelTypes.bind(this);
        this._toggleEditDialog = this._toggleEditDialog.bind(this);
        this._toggleShowDialog = this._toggleShowDialog.bind(this);
        this._toggleNewDialog = this._toggleNewDialog.bind(this);
    }

    componentDidMount() {
        // fill the store
        BarrelTypeStore.loadData(null)
            .then(data => {
                // save the component token
                this.BarrelTypeStoreToken = data.token;
            })
            .catch(error => console.log("load barrel types error", error));
        // listen the stores changes
        BarrelTypeStore.addChangeListener(this._setBarrelTypes);
        // init team list
        this._setBarrelTypes();
    }

    componentWillUnmount() {
        // clear store
        BarrelTypeStore.unloadData(this.BarrelTypeStoreToken);
        // remove the stores listeners
        BarrelTypeStore.removeChangeListener(this._setBarrelTypes);
    }

    /**
     * Update the barrel types list in the component state
     */
    _setBarrelTypes() {
        this.setState({ types: BarrelTypeStore.types });
    }

    /**
     * Toggle the boolean to show the dialog to edit the given barrel type
     *
     * @param {object} barrelType : the barrel type to edit
     */
    _toggleEditDialog(barrelType) {
        this.setState({
            openEditDialog: !this.state.openEditDialog,
            selected: barrelType
        });
    }

    /**
     * Toggle the boolean to show the dialog with the details of the given barrel type
     *
     * @param {object} barrelType : the barrel type to show
     */
    _toggleShowDialog(barrelType) {
        this.setState({
            openShowDialog: !this.state.openShowDialog,
            selected: barrelType
        });
    }

    /**
     * Toggle the boolean to show the dialog to create a new barrel type
     */
    _toggleNewDialog() {
        this.setState({ openNewDialog: !this.state.openNewDialog });
    }

    render() {

        const style = {
            container: {
                position: 'relative',
                height: '100%',
                overflow: 'auto',
            },
            floatingButton: {
                position: 'absolute',
                right: '82px',
                bottom: '82px',
            }
        };

        return (
            <div className="container-hide">
                <div style={style.container}>
                    <List>
                        {
                            this.state.types.map(type => {
                                return <BarrelType
                                    key={type.id}
                                    type={type}
                                    edit={this._toggleEditDialog}
                                    show={this._toggleShowDialog}
                                />
                            })
                        }
                    </List>

                    <FloatingActionButton
                        style={style.floatingButton}
                        secondary={true}
                        onTouchTap={this._toggleNewDialog}
                    >
                        <ContentAddIcon />
                    </FloatingActionButton>

                    <NewBarrelType
                        show={this.state.openNewDialog}
                        close={this._toggleNewDialog}
                    />

                    <ShowBarrelType
                        show={this.state.openShowDialog}
                        close={this._toggleShowDialog}
                        type={this.state.selected}
                    />

                    <EditBarrelType
                        show={this.state.openEditDialog}
                        close={this._toggleEditDialog}
                        type={this.state.selected}
                    />

                </div>
            </div>
        );
    }

}
