import React from 'react';

import Dialog from 'app/components/ResponsiveDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';

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
            <FlatButton
                label="Fermer"
                secondary={true}
                onTouchTap={this.props.close}
            />,
        ];

        if(this.state.value == 'ip') {
            actions.push(
                <FlatButton
                    label="Ajouter"
                    primary={true}
                    type="submit"
                    onTouchTap={(this.AddIpMemberForm ? this.AddIpMemberForm.submit : () => {})}
                />
            )
        }


        return (
            <Dialog
                open={this.props.show}
                actions={actions}
                autoScrollBodyContent={true}
                modal={false}
                onRequestClose={this.props.close}
                bodyClassName="TabDialog__body"
            >
                <Tabs contentContainerClassName="TabDialog__TabsContent"
                    onChange={(value) => this.setState({value: value})}
                    >
                    <Tab label="Depuis EtuUTT" value="etuutt">
                        <AddEtuuttMemberForm team={this.state.team} />
                    </Tab>
                    <Tab label="Par IP" value="ip">
                        <AddIpMemberForm team={this.state.team} ref={(ref) => { this.AddIpMemberForm = ref; }}/>
                    </Tab>
                </Tabs>

            </Dialog>
        );
    }

}
