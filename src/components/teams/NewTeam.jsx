import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';

import SelectGroup from './formElements/SelectGroup.jsx';
import SelectRole from './formElements/SelectRole.jsx';
import TeamService from '../../services/TeamService';

export default class NewTeam extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            name: '',
            role: '',
            group: '',
            location: '',
        };

        // binding
        this._createNewTeam = this._createNewTeam.bind(this);
    }

    /**
     * Call the Team Service to create a new team
     */
    _createNewTeam() {
        TeamService.createTeam(this.state, err => {
            if (err) {
                console.log("create team err", err);
            } else {
                this.setState({
                    name: '',
                    role: '',
                    group: '',
                    location: '',
                });
                this.props.close();
            }
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this.props.close}
            />,

            // TODO trigger on field submit
            <FlatButton
                label="Créer"
                primary={true}
                onTouchTap={this._createNewTeam}
            />,
        ];

        return (
            <Dialog
                title={'Création d\'une équipe'}
                open={this.props.show}
                actions={actions}
                modal={true}
            >

                <Row>
                    <Col xs={12} sm={6}>
                        <TextField
                            floatingLabelText="Nom"
                            value={this.state.name}
                            onChange={e => this.setState({name: e.target.value})}
                            required={true}
                        /><br/>
                        <SelectRole
                            selected={this.state.role}
                            onChange={v => this.setState({role: v})}
                        /><br/>
                    </Col>
                    <Col xs={12} sm={6}>
                        <TextField
                            floatingLabelText="Emplacement (facultatif)"
                            value={this.state.location}
                            onChange={e => this.setState({location: e.target.value})}
                        /><br/>
                        <SelectGroup
                            value={this.state.group}
                            onChange={v => this.setState({group: v})}
                        />
                    </Col>
                </Row>
            </Dialog>
        );
    }

}
