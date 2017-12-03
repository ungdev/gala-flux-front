import React from 'react';

import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import Button from 'material-ui/Button';
import Tabs, { Tab } from 'material-ui/Tabs';

import AddEtuuttMemberForm from "app/Teams/components/AddEtuuttMemberForm.jsx";
import AddIpMemberForm from "app/Teams/components/AddIpMemberForm.jsx";

export default class AddMemberDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: props.team,
            value: 'etuutt',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    render() {
        return (
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
            >
                <Tabs
                    value={this.state.value}
                    onChange={(e,v) => this.setState({value: v})}
                    centered
                >
                    <Tab label="Depuis EtuUTT" value="etuutt"/>
                    <Tab label="Par IP" value="ip"/>
                </Tabs>

                { this.state.value == 'etuutt' ?
                    <AddEtuuttMemberForm team={this.state.team} close={this.props.close}/>
                :
                    <AddIpMemberForm team={this.state.team} inputRef={(ref) => { this.AddIpMemberForm = ref; }} close={this.props.close}/>
                }
            </Dialog>
        );
    }

}
