import React from 'react';

import Button from 'material-ui/Button';
import Dialog, { withMobileDialog } from 'material-ui/Dialog';

import NotificationStore from 'stores/NotificationStore';
require('./ResponsiveDialog.scss');

class ResponsiveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: this.props.open,
        };
        if(props.open) {
            if(global.Android) Android.setModal(props.open);
        }
    }

    componentWillReceiveProps(props) {
        if(props.open != this.state.open) {
            this.setState({open: props.open});
            if(global.Android) Android.setModal(props.open);
        }
    }

    componentWillUnmount() {
        if(this.props.open) {
            if(global.Android) Android.setModal(false);
        }
    }

    render() {
        const { fullScreen } = this.props;
        
        let props = Object.assign({}, this.props);
        props.fullScreen = fullScreen;
        props.className = 'ResponsiveDialog ' + (props.className || '');
        return React.createElement(Dialog, props);
    }
}
export default withMobileDialog()(ResponsiveDialog);
