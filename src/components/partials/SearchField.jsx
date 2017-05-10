import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import SearchIcon from 'material-ui/svg-icons/action/search';
require('styles/partials/SearchField.scss');

export default class SearchField extends React.Component {

    constructor(props) {
        super(props);
        /**
         * Props:
         * - disabled
         * - errorText
         * - floatingLabelText
         * - onSubmit(value)
         * - value
         * - loading
         */

        this.state = {
            value: this.props.value ? this.props.value : '',
        };

         this._handleChange = this._handleChange.bind(this);
         this._handleSubmit = this._handleSubmit.bind(this);
         this.focus = this.focus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    _handleChange(e) {
        this.setState({value: e.target.value});
    }

    _handleSubmit(e) {
        e.preventDefault();
        if(this.props.onSubmit) {
            this.props.onSubmit(this.state.value);
            this.focus();
        }
    }

    focus() {
        if(this.textInput) {
            this.textInput.focus();
        }
    }

    render() {
        return (
            <form className="search-field" onSubmit={this._handleSubmit}>
                <TextField
                    disabled={this.props.disabled}
                    floatingLabelText={this.props.floatingLabelText}
                    fullWidth={true}
                    value={this.state.value}
                    errorText={this.props.errorText}
                    readOnly={this.props.loading}
                    onChange={this._handleChange}
                    autoFocus={true}
                    name="searchTextField"
                    ref={(input) => { this.textInput = input; }}
                />
                {
                    this.props.loading
                    ?
                    <CircularProgress size={30} className="search-field__progress" />
                    :
                    <IconButton
                        className="search-field__button"
                        type="submit"
                        disabled={this.props.disabled}
                    >
                        <SearchIcon />
                    </IconButton>
                }
            </form>
        );
    }
}
