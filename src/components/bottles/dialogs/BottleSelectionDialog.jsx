import React from 'react';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import BottleTypeService from 'services/BottleTypeService';
import NotificationActions from 'actions/NotificationActions';
import Confirm from 'components/partials/Confirm.jsx';


/**
 * @param {BottleType} type
 * @param {integer} count Current number of bottles available
 */
export default class BottleSelectionDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
            count: props.count || 0,
            values: {
                'byBottle': localStorage.getItem('bottle/selectionMode') == 'true' || false,
                'selected': ((localStorage.getItem('bottle/selectionMode') == 'true' || false) ? props.selected : (props.selected / props.type.quantityPerBox)) || 0,
            },
            errors: {},
        };

        this.focus();

        // binding
        this._handleFieldChange = this._handleFieldChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            type: props.type,
            count: props.count || 0,
            values: {
                'byBottle': localStorage.getItem('bottle/selectionMode') == 'true' || false,
                'selected': ((localStorage.getItem('bottle/selectionMode') == 'true' || false) ? props.selected : (props.selected / props.type.quantityPerBox)) || 0,
            },
            errors: {},
        });

        this.focus();
    }


    /**
     * Called on field change
     *
     * @param  {string} field Field name
     * @param  {string} value New value
     */
    _handleFieldChange(field, value) {
        let values = this.state.values;

        // Update count according to "byBottle" value
        if(field == 'byBottle' && this.state.values.byBottle != value && this.state.type.quantityPerBox > 1) {
            localStorage.setItem('bottle/selectionMode', value);
            if(value) {
                values.selected = values.selected * this.state.type.quantityPerBox;
            }
            else if(Number.isInteger(values.selected / this.state.type.quantityPerBox)) {
                values.selected = values.selected / this.state.type.quantityPerBox;
            }
        }

        // Save new field value
        values[field] = value;

        // Integer number testing
        if(field === 'selected') {
            values[field] = values[field].replace(/[^0-9]/, '');
            if(values['byBottle']) {
                values[field] = values[field] > this.state.count ? this.state.count : values[field];
            }
            else {
                values[field] = values[field] > parseInt(this.state.count/this.state.type.quantityPerBox) ? parseInt(this.state.count/this.state.type.quantityPerBox) : values[field];
            }
        }

        this.setState({
            values: values,
            errors: {},
        });
    }

    /**
     * Call the BottleType Service to update BottleType
     *
     * @param {Event} e Event like form submit that will be stopped
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }

        if(this.props.submit) {
            if(this.state.values.byBottle) {
                this.props.submit(this.state.values.selected);
            }
            else {
                this.props.submit(this.state.values.selected * this.state.type.quantityPerBox);
            }
        }

    }

    focus() {
        if(this.focusField) {
            if(this.focusField.input && this.focusField.input.setSelectionRange) {
                this.focusField.input.setSelectionRange(0, this.focusField.input.value.length)
            }
            else {
                this.focusField.focus();
            }
        }
    }


    render() {

        const actions = [
            <FlatButton
                label="Désélectionner"
                secondary={true}
                onTouchTap={() => (this.props.submit && this.props.submit(0))}
                className="Dialog__DeleteButon"
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Sélectionner"
                primary={true}
                type="submit"
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (

            <Dialog
                title={'Sélection de ' + (this.state.values.byBottle?'bouteilles':'cartons') + ' : ' + this.state.type.name}
                open={this.props.show}
                actions={actions}
                onRequestClose={this.props.close}
            >

                <form onSubmit={this._handleSubmit}>
                    <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>
                    Selectionner
                    <TextField
                        name="selected"
                        errorText={this.state.errors.selected}
                        maxLength="3"
                        value={this.state.values.selected}
                        onChange={e => this._handleFieldChange('selected', e.target.value)}
                        autoFocus={true}
                        ref={(field) => { this.focusField = field; }}
                        style={{width: '40px', display: 'inline-block', verticalAlign: 'middle', margin: '0 3px'}}
                        inputStyle={{textAlign: 'center'}}
                        />
                    <SelectField
                        value={this.state.values.byBottle}
                        onChange={(e, i, v) => this._handleFieldChange('byBottle', v)}
                        style={{width: '150px', display: 'inline-block', verticalAlign: 'middle', margin: '0 3px'}}
                    >
                        <MenuItem
                            value={true}
                            primaryText={'bouteille' + (this.state.values.selected > 1 ? 's' : '')}
                        />
                        <MenuItem
                            value={false}
                            primaryText={'carton' + (this.state.values.selected > 1 ? 's' : '')}
                        />
                    </SelectField>
                    .
                </form>
            </Dialog>
        );
    }

}
