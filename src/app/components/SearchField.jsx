import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { CircularProgress } from 'material-ui/Progress';
import SearchIcon from 'material-ui-icons/Search';
require('./SearchField.scss');

/**
 * @param onSubmit(value)
 * @param loading
 * Every other parameters will be forwarded to the TextField
 */
export default class SearchField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : '',
        };

         this.handleChange = this.handleChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.focus = this.focus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        if(this.props.onChange) {
            this.props.onChange(e);
        }
    }

    handleSubmit(e) {
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
        const {onChange, value, loading, onSubmit, ...props} = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    fullWidth
                    value={this.state.value}
                    readOnly={this.props.loading}
                    onChange={this.handleChange}
                    inputRef={(input) => { this.textInput = input; }}
                    {...props}
                    InputProps={{
                        endAdornment:(
                        <InputAdornment position="end">
                        {
                            this.props.loading
                            ?
                            <CircularProgress size={30}/>
                            :
                            <IconButton type="submit">
                                <SearchIcon />
                            </IconButton>
                        }
                        </InputAdornment>
                    )}}
                />
            </form>
        );
    }
}
