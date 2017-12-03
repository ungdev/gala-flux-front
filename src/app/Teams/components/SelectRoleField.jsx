import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import AuthService from 'services/AuthService';

import Select from 'material-ui/Select';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

export default class SelectRoleField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
        };
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
        let {...props} = this.props;
        return (
            <TextField
                select
                {...props}
            >
                {
                    this.state.options.map((option, i) => {
                        return <SelectableMenuItem key={option} value={option}>{option}</SelectableMenuItem>
                    })
                }
            </TextField>
        );
    }

}
