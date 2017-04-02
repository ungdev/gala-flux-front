import React from 'react';

import AlertButtonStore from '../../stores/AlertButtonStore';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NewButton  from './NewButton.jsx';
import AdminButton from './AdminButton.jsx';

export default class ButtonList extends React.Component {

    constructor() {
        super();

        this.state = {
            buttons: [],
            categories: [],
            selectedCategory: null,
            showCreateDialog: false
        };

        // binding
        this._onAlertButtonStoreChange = this._onAlertButtonStoreChange.bind(this);
        this._toggleCreateDialog = this._toggleCreateDialog.bind(this);
    }

    componentDidMount() {
        // listen stores changes
        AlertButtonStore.addChangeListener(this._onAlertButtonStoreChange);
    }

    componentWillUnmount() {
        // remove the stores listeners
        AlertButtonStore.removeChangeListener(this._onAlertButtonStoreChange);
    }

    _onAlertButtonStoreChange() {
        const buttons = AlertButtonStore.buttons;
        const categories = [];
        // get distinct categories
        for (let button of buttons) {
            if (categories.indexOf(button.category) === -1) {
                categories.push(button.category);
            }
        }

        this.setState({ buttons, categories });

    }

    _toggleCreateDialog() {
        this.setState({ showCreateDialog: !this.state.showCreateDialog })
    }

    render() {

        const style = {
            floatingButton: {
                position: 'absolute',
                right: 36,
                bottom: 36,
            }
        };

        return (
            <div>
                <SelectField
                    floatingLabelText="Categorie"
                    value={this.state.selectedCategory}
                    onChange={(e, i, v) => this.setState({ selectedCategory: v })}
                >
                    {
                        this.state.categories.map((category, i) => {
                            return <MenuItem key={i} value={category} primaryText={category} />
                        })
                    }
                </SelectField>
                {
                    // show only the buttons where the category his the selected category
                    this.state.buttons.map((button, i) => {
                        if (button.category === this.state.selectedCategory) {
                            return  <AdminButton
                                key={i}
                                button={button}
                            />
                        }
                    })
                }

                <FloatingActionButton
                    style={style.floatingButton}
                    secondary={true}
                    onTouchTap={this._toggleCreateDialog}
                >
                    <ContentAddIcon />
                </FloatingActionButton>

                <NewButton
                    show={this.state.showCreateDialog}
                    close={this._toggleCreateDialog}
                />
            </div>
        );
    }

}