import React from 'react';

import Button from 'material-ui/Button';
import Dialog from 'app/components/ResponsiveDialog.jsx';


/**
 * this component will show a dialog that call `props.yes` on confirmation
 * @param {Component} children The text contain in this tag will be the question text
 * @param {boolean} show If true the confirm will be shown
 * @param {function} yes Will be called on confirmation
 * @param {function} no Will be called on cancellation
 */
export default class Confirm extends React.Component {

    render() {
        const actions = [
            <Button
                secondary={true}
                onTouchTap={this.props.no}
            >
                Non
            </Button>,
            <Button
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.props.yes}
            >
                Oui
            </Button>,
        ];

        return (
            <div>
                <Dialog
                    title={'Confirmation'}
                    open={this.props.show}
                    actions={actions}
                    modal={false}
                    onRequestClose={this.props.no}
                >
                    {this.props.children}
                </Dialog>
            </div>
        );
    }

}
