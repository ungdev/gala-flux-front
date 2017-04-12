import React from 'react';

import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import NotificationStore from '../../stores/NotificationStore';

export default class LoadingNotification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingMessage: NotificationStore.loadingMessage,
        };
    }

    componentDidMount() {
        // listen the store change
        NotificationStore.addChangeListener(this._onNotificationStoreChange.bind(this));
    }

    _onNotificationStoreChange() {
        let loadingMessage = NotificationStore.loadingMessage;
        this.setState({ loadingMessage: loadingMessage });
    }

    render() {
        let style = {
            content: {
                textAlign: 'center',
            },
            big: {
                display: 'block',
                paddingTop: '40px',
                fontSize: '1.5em',
            }
        };

        return (
            <div>
                <Dialog
                    contentStyle={style.content}
                    open={this.state.loadingMessage != null}
                    modal={true}
                >
                    <CircularProgress size={80} thickness={5} /><br/>
                    <big style={style.big}>{this.state.loadingMessage}</big>
                </Dialog>
            </div>
        );
    }

}
