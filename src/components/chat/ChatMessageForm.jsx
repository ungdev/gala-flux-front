import React from 'react';

import ChatService from 'services/ChatService';
import ChatStore from 'stores/ChatStore';
import ChatActions from 'actions/ChatActions';

import RaisedButton from 'material-ui/RaisedButton';
import ContentSendIcon from 'material-ui/svg-icons/content/send';
import NotificationActions from 'actions/NotificationActions';

require('styles/chat/ChatMessageForm.scss');


/**
 * This will show a form to send new message into the given channel
 * @param {string} channel Facultative channel
 */
export default class ChatMessageForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: localStorage.getItem('chat/input/'+props.channel) || '',
            channel: props.channel,
            multiline: false,
        };

         this._handleChange = this._handleChange.bind(this);
         this._handleSubmit = this._handleSubmit.bind(this);
         this._handleKeyDown = this._handleKeyDown.bind(this);
         this.focus = this.focus.bind(this);
         this._onTextAreaClick = this._onTextAreaClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let value =  this.state.value;
        if(nextProps != this.state.channel) {
            value = localStorage.getItem('chat/input/'+nextProps.channel) || '';
        }
        this.setState({
            channel: nextProps.channel,
            value: value,
            multiline: false,
        });
    }

    componentDidUpdate() {
        if(this.textInput && this.textInput.clientHeight != this.textInput.scrollHeight && !this.state.multiline) {
            this.setState({multiline: true})
        }
    }

    _handleChange(e) {
        this.setState({value: e.target.value ? e.target.value : ''});
        if(e.target) {
            localStorage.setItem('chat/input/'+this.state.channel, e.target.value);
        }
    }

    /**
     * Will submit on enter, and add new line on ctrl+enter
     * @param e: event
     */
    _handleKeyDown(e) {
        ChatActions.viewMessages(this.state.channel);
        if (e.keyCode === 13) {
            // Submit on enter press
            if(!e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                this._handleSubmit(e);
            }
            // Generally on browser ctrl+enter doesn't do anything, so we will manually insert return
            else if(e.ctrlKey && e.target && typeof e.target.selectionStart == 'number') {
                e.preventDefault();
                let finalSelection = e.target.selectionStart+1;
                e.target.value = this.state.value.slice(0, e.target.selectionStart) + '\n' + this.state.value.slice(e.target.selectionEnd);
                e.target.setSelectionRange(finalSelection,finalSelection);
                this.setState({value: e.target.value});
                localStorage.setItem('chat/input/'+this.state.channel, e.target.value);
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
            ChatActions.viewMessages(this.state.channel);
            localStorage.setItem('chat/input/'+this.state.channel, '');
            this.setState({
                value: '',
                multiline: false,
            });
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

    /**
     * Handle click on the textarea
     */
    _onTextAreaClick() {
        // if there was new messages for this channel, reset the new messages counter
        ChatActions.viewMessages(this.state.channel);
     }

    render() {
        // Show multiline style only if there is more than one line in the field
        let style = {};
        if(this.state.value.includes('\n') || this.state.multiline) {
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
                        onClick={this._onTextAreaClick}
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
