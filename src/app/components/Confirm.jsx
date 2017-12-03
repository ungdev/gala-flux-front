import React from 'react';

import Button from 'material-ui/Button';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
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
        return (
            <div>
                <Dialog
                    open={this.props.show}
                    onRequestClose={this.props.no}
                >
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="accent"
                            onTouchTap={this.props.no}
                        >
                            Non
                        </Button>
                        <Button
                            color="primary"
                            autoFocus
                            onTouchTap={this.props.yes}
                        >
                            Oui
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}
