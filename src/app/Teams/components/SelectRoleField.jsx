import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import AuthService from 'services/AuthService';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class SelectRoleField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            selected: props.selected,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    componentDidMount() {
        AuthService.getRoles()
            .then(roles => {
                roles = Object.keys(roles);
                roles.sort((a,b) => {return a.localeCompare(b)});
                this.setState({ options: roles });
            })
            .catch(error => {
                NotificationActions.error('Une erreur s\'est produite pendant le chargement de la liste des permissions', error);
            });
    }

    render() {
        return (
            <SelectField
                floatingLabelText="Autorisations"
                value={this.state.selected}
                onChange={(e, index, value) => this.props.onChange(value)}
                errorText={this.props.errorText}
                fullWidth={this.props.fullWidth}
                maxHeight={200}
            >
                {
                    this.state.options.map((option, i) => {
                        return <MenuItem key={i} value={option} primaryText={option} />
                    })
                }
            </SelectField>
        );
    }

}
