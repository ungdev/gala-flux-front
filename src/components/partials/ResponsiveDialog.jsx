import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import NotificationStore from 'stores/NotificationStore';
import AuthActions from 'actions/AuthActions';

require('styles/partials/ResponsiveDialog.scss');

export default class ResponsiveDialog extends React.Component {

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
        let props = Object.assign({}, this.props);
        props.autoScrollBodyContent = true;
        props.className = 'ResponsiveDialog ' + (props.className || '');
        props.actionsContainerClassName = 'ResponsiveDialog__actions ' + (props.actionsContainerClassName || '');
        props.bodyClassName = 'ResponsiveDialog__body ' + (props.bodyClassName || '');
        props.contentClassName = 'ResponsiveDialog__content ' + (props.contentClassName || '');
        props.overlayClassName = 'ResponsiveDialog__overlay ' + (props.overlayClassName || '');
        props.titleClassName = 'ResponsiveDialog__title ' + (props.titleClassName || '');
        return React.createElement(Dialog, props);
    }
}
