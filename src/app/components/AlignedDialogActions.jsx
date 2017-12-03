import React from 'react';
import { DialogActions } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    action: {
        '&:first-child': {
            flex: 'auto',
        }
    },
});

/**
 * Extend DialogActions to allow first button to be aligned to the left
 */
class AlignedDialogActions extends React.Component {
    render() {
        return (
            <DialogActions {...this.props}/>
        );
    }
}
export default withStyles(styles)(AlignedDialogActions);
