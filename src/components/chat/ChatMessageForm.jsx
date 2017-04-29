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
         this._handleKeyDown = this._handleKeyDown.bind(this);
         this.focus = this.focus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value ? nextProps.value : ''});
    }

    _handleChange(e) {
        this.setState({value: e.target.value ? e.target.value : ''});
    }

    /**
     * Will submit on enter, and add new line on ctrl+enter
     * @param e: event
     */
    _handleKeyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            if(!e.ctrlKey && !e.shiftKey) {
                this._handleSubmit(e);
            }
            else {
                this.setState({ value: this.state.value + '\n'});
            }
        }
    }

    _handleSubmit(e) {
        e.preventDefault();
        this.focus();

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
            this.focus();
        })
        .catch(error => {
            NotificationActions.error('Une erreur s\'est produite pendant l\'envoi du message', error);
        });
    }

    focus() {
        if(this.textInput) {
            this.textInput.focus();
        }
    }

    render() {

        // Show multiline style only if there is more than one line in the field
        let style = {};
        if(this.state.value.indexOf('\n') !== -1) {
            style.lineHeight = 'normal';
        }

        return (
                <form onSubmit={this._handleSubmit} className="ChatMessageForm">
                    <textarea
                        className="ChatMessageForm__input"
                        type="text"
                        value={this.state.value}
                        onChange={this._handleChange}
                        onKeyDown={this._handleKeyDown}
                        autoFocus={true}
                        ref={(input) => { this.textInput = input; }}
                        placeholder="Votre message.."
                        style={style}
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
