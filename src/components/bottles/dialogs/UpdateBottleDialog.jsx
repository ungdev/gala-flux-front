import React from 'react';

import Dialog from 'components/partials/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid';

import BottleActionService from 'services/BottleActionService';
import NotificationActions from 'actions/NotificationActions';
import Confirm from 'components/partials/Confirm.jsx';


/**
 * @param {BottleType} type
 * @param {integer} count Current number of bottles available
 * @param {integer} total Total number of bottle (no matter the state)
 * @param {Team} team
 * @param {string} state State of bottles
 */
export default class UpdateBottleDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            count: props.count || 0,
            total: props.total || 0,
            team: props.team,
            state: props.state,
            values: {
                'box': parseInt(props.count / props.type.quantityPerBox) || 0,
                'bottle': (props.count % props.type.quantityPerBox) || 0,
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

        console.log('props', props.total)
        this.setState({
            type: props.type,
            count: props.count || 0,
            total: props.total || 0,
            values: {
                'box': parseInt(props.count / props.type.quantityPerBox) || 0,
                'bottle': (props.count % props.type.quantityPerBox) || 0,
            },
            errors: {},
        });

        this.focus();
    }

    componentDidMount() {
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
        // Save new field value
        values[field] = value;

        // Integer number testing
        if(field === 'box' || field === 'bottle') {
            values[field] = values[field].replace(/[^0-9]/, '');

            let limit = this.state.count;
            if(this.state.state != 'new') {
                limit = this.state.total;
            }

            if(values['box'] > parseInt(limit / this.state.type.quantityPerBox)) {
                values['box'] = parseInt(limit / this.state.type.quantityPerBox);
                values['bottle'] = parseInt(limit % this.state.type.quantityPerBox);
            }
            if(values['bottle'] > limit - (values['box'] * this.state.type.quantityPerBox)) {
                values['bottle'] =  limit - (values['box'] * this.state.type.quantityPerBox);
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

        let box = parseInt(this.state.values.box || 0);
        let bottle = parseInt(this.state.values.bottle || 0);
        let quantityPerBox = parseInt(this.state.type.quantityPerBox || 1);
        let count = parseInt(this.state.count || 0);

        let quantity = count - (box * quantityPerBox + bottle);

        if(quantity != 0) {
            BottleActionService.create({
                team: this.state.team.id,
                type: this.state.type.id,
                quantity: quantity,
                operation: 'purchased',
            })
            .then(() => {
                NotificationActions.snackbar('Vos modifications ont été enregistrées.');
                this.props.close();
            })
            .catch(error => NotificationActions.error("Erreur lors de l'etat des fûts.", error));
        }
        else {
            NotificationActions.snackbar('Rien n\'a été modifié.');
            this.props.close();
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
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Sauvegarder"
                primary={true}
                type="submit"
                onTouchTap={this._handleSubmit}
            />,
        ];

        return (

            <Dialog
                title={'Mise à jour de ' + this.state.type.name + ' restant'}
                open={this.props.show}
                actions={actions}
                onRequestClose={this.props.close}
            >

                <form onSubmit={this._handleSubmit}>
                    <button type="submit" style={{display:'none'}}>Hidden submit button, necessary for form submit</button>

                    Il reste
                    <TextField
                        name="box"
                        errorText={this.state.errors.box}
                        maxLength="3"
                        value={this.state.values.box}
                        onChange={e => this._handleFieldChange('box', e.target.value)}
                        autoFocus={true}
                        ref={(field) => { this.focusField = field; }}
                        style={{width: '40px', display: 'inline-block', verticalAlign: 'middle', margin: '0 3px'}}
                        inputStyle={{textAlign: 'center'}}
                        /> carton{(this.state.values.box > 1 ? 's' : '')} et
                    <TextField
                        name="bottle"
                        errorText={this.state.errors.bottle}
                        maxLength="3"
                        value={this.state.values.bottle}
                        onChange={e => this._handleFieldChange('bottle', e.target.value)}
                        style={{width: '40px', display: 'inline-block', verticalAlign: 'middle', margin: '0 3px'}}
                        inputStyle={{textAlign: 'center'}}
                        /> bouteille{(this.state.values.bottle > 1 ? 's ' : ' ')}
                        de <strong>{this.state.type.name}</strong> (<strong>{this.state.type.shortName}</strong>).
                </form>
            </Dialog>
        );
    }

}
