import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ContentSendIcon from 'material-ui/svg-icons/content/send';
import ChatService from '../../services/ChatService';
import NotificationActions from '../../actions/NotificationActions';

require('../../styles/chat/ChatMessageForm.scss');


/**
 * This will show a form to send new message into the given channel
 * @param {string} channel Facultative channel
 */
export default class ChatMessageForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : '',
        };

         this._handleChange = this._handleChange.bind(this);
         this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value ? nextProps.value : ''});
    }

    _handleChange(e) {
        this.setState({value: e.target.value ? e.target.value : ''});
    }

    _handleSubmit(e) {
        e.preventDefault();

        // Ignore if field is empty
        if(!this.state.value) {
            return;
        }

        // Create new message
        ChatService.create({
            text: this.state.value,
            channel: this.props.channel,
        })
        .then(() => {
            this.setState({value: ''});
            this.textInput.focus();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant l\'envoi du message', error);
        });
    }

    render() {
        return (
                <form onSubmit={this._handleSubmit} className="ChatMessageForm">
                    <input
                        className="ChatMessageForm__input"
                        type="text"
                        value={this.state.value}
                        onChange={this._handleChange}
                        autoFocus={true}
                        ref={(input) => { this.textInput = input; }}
                        placeholder="Votre message.."
                    />

                    <RaisedButton
                        type="submit"
                        className="ChatMessageForm__button"
                        primary={true}
                        disabled={!this.state.value}
                        icon={<ContentSendIcon />}
                    />
                </form>
        );
    }
}