import React from "react";

import TeamStore from '../../stores/TeamStore';
import AlertButtonService from '../../services/AlertButtonService';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';

export default class ButtonForm extends React.Component {

    constructor() {
        super();

        this.state = {
            categories: [
                "manque",
                "sante",
                "securite",
                "technique"
            ],
            teams: [],
            formData: {
                title: {
                    error: null,
                    value: ""
                },
                category: {
                    error: null,
                    value: null
                },
                receiver: {
                    error: null,
                    value: null
                },
                messageRequired: {
                    value: false
                },
                placeholder: {
                    value: ""
                }
            }
        };

        // binding
        this._onTeamStoreChange = this._onTeamStoreChange.bind(this);
        this._submitForm = this._submitForm.bind(this);
    }

    componentDidMount() {
        // listen the stores changes
        TeamStore.addChangeListener(this._onTeamStoreChange);
        // init team list
        this.setState({ teams: TeamStore.teams });
    }

    componentWillUnmount() {
        // remove the stores listeners
        TeamStore.removeChangeListener(this._onTeamStoreChange);
    }

    _onTeamStoreChange() {
        this.setState({ teams: TeamStore.teams });
    }

    _setFormDataAttribute(attribute, value) {
        const state = this.state;
        state.formData[attribute].value = value;
        this.setState(state);
    }

    _submitForm() {
        const state = this.state;

        // check if required attributes are set
        let errCounter = 0;
        if (!state.formData.title.value) {
            state.formData.title.error = "Title required";
            errCounter++;
        }
        if (!state.formData.category.value) {
            state.formData.category.error = "Category required";
            errCounter++;
        }
        if (!state.formData.receiver.value) {
            state.formData.receiver.error = "Receiver required";
            errCounter++;
        }

        // if no error, submit the form
        if (errCounter === 0) {
            const data = {
                receiver: state.formData.receiver.value,
                title: state.formData.title.value,
                message: state.formData.messageRequired.value,
                messagePlaceholder: state.formData.placeholder.value,
                category: state.formData.category.value,
            };
            console.log(data);
            AlertButtonService.createAlertButton(data, (error, result) => {
                if (error) {
                    console.log("create alert button error : ", error);
                } else {
                    console.log("create alert button : ", result);
                }
            });
        } else {
            // else display errors
            this.setState(state);
        }
    }

    render() {

        const formData = this.state.formData;

        return (
            <div>
                <TextField
                    floatingLabelText="Button title"
                    value={formData.title.value}
                    onChange={e => this._setFormDataAttribute("title", e.target.value)}
                    errorText={formData.title.error}
                />
                <SelectField
                    onChange={(e, i, v) => this._setFormDataAttribute("category", v)}
                    value={formData.category.value}
                    errorText={formData.category.error}
                >
                    {
                        this.state.categories.map((category, i) => {
                            return <MenuItem key={i} value={category} primaryText={category} />
                        })
                    }
                </SelectField>
                <SelectField
                    onChange={(e, i, v) => this._setFormDataAttribute("receiver", v)}
                    value={formData.receiver.value}
                    errorText={formData.receiver.error}
                >
                    {
                        this.state.teams.map((team, i) => {
                            return <MenuItem key={i} value={team.id} primaryText={team.name} />
                        })
                    }
                </SelectField>
                <Toggle
                    label="Message obligatoire :"
                    onToggle={_ => this._setFormDataAttribute("messageRequired", !formData.messageRequired.value)}
                    style={{maxWidth: 300}}
                />
                <TextField
                    floatingLabelText="Message placeholder"
                    value={formData.placeholder.value}
                    onChange={e => this._setFormDataAttribute("placeholder", e.target.value)}
                />
                <RaisedButton
                    label="Create button"
                    primary={true}
                    onClick={this._submitForm}
                />
            </div>
        );
    }

}