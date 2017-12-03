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

        let actions = [
            <Button
                color="accent"
                onTouchTap={this.props.close}
            >
                Fermer
            </Button>,
        ];

        if(this.state.value == 'ip') {
            actions.push(
                <Button
                    color="primary"
                    type="submit"
                    onTouchTap={(this.AddIpMemberForm ? this.AddIpMemberForm.submit : () => {})}
                >
                    Ajouter
                </Button>
            )
        }


        return (
            <Dialog
                open={this.props.show}
                onRequestClose={this.props.close}
                className="TabDialog__body"
            >
                <Tabs contentContainerClassName="TabDialog__TabsContent"
                    onChange={(value) => this.setState({value: value})}
                    >
                    <Tab label="Depuis EtuUTT" value="etuutt">
                        <AddEtuuttMemberForm team={this.state.team} />
                    </Tab>
                    <Tab label="Par IP" value="ip">
                        <AddIpMemberForm team={this.state.team} inputRef={(ref) => { this.AddIpMemberForm = ref; }}/>
                    </Tab>
                </Tabs>
            </Dialog>
        );
    }

}
