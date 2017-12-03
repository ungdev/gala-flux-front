import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Menu, { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    container: {
        postion: 'absolute',
    },
    suggestionsContainerOpen: {
        position: 'fixed',
        zIndex: theme.zIndex.popover,
    },
    suggestion: {},
    suggestionsList: {
        listStyleType: 'none',
        padding: 0,
    },
});

/**
 * Autocomplete Field
 * @param {bool} openOnFocus If true, suggestion list will be open even when field is empty (default: flase)
 * @param {int} maxSearchResults Maximum number of results (default: 5)
 * @param {[{label: 'xx'}]} suggestions Array of object with at least the 'label' attribute which will be shown
 * on the suggestion list. Suggestion matching will also be done on this label. You can put other attributes
 * in the object, the whole object will be returned in case of onSuggestionSelected
 * @param {funcntion({label: 'xx'})} onSuggestionSelected Function called when user select a suggestion. In this callback you have to manually update the value.
 * @param {string} value
 */
class AutoComplete extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            suggestions: [],
        };

        // binding
        this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
        this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.handleShouldRenderSuggestions = this.handleShouldRenderSuggestions.bind(this);
        this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this);

    }

    handleSuggestionsFetchRequested({ value }) {
        const inputValue = value.trim().toLowerCase();
        const maxSearchResults = (this.props.maxSearchResults !== undefined ? this.props.maxSearchResults : 5);
        let suggestions = [];

        if(inputValue.length !== 0 || this.props.openOnFocus) {
            let count = 0;
            suggestions = this.props.suggestions;
            suggestions = suggestions.filter(suggestion => {
                if (count < maxSearchResults && String(suggestion.label).toLowerCase().indexOf(inputValue) !== -1) {
                    count++;
                    return true;
                }
                return false;
            });
        }

        this.setState({
            suggestions,
        });
    };

    handleSuggestionsClearRequested() {
        this.setState({
            suggestions: [],
        });
    };

    handleChange(e) {
        if(this.props.onChange) {
            this.props.onChange(e);
        }
    };

    handleShouldRenderSuggestions(value) {
        return value.trim().length > 0 || this.props.openOnFocus;
    }

    handleSuggestionSelected(e, {suggestion}) {
        if(this.props.onSuggestionSelected) {
            this.props.onSuggestionSelected(suggestion);
        }
    }

    getSuggestionValue(suggestion) {
        return suggestion.label;
    }

    renderInput(inputProps) {
        const { ref, ...other } = inputProps;
        return (
            <TextField
                inputRef={(node) => {
                    this.textFieldRef = node;
                    if(ref) {
                        ref(node);
                    }
                }}
                { ...other}
            />
        );
    }

    renderSuggestion(suggestion, { query, isHighlighted }) {
        const matchBegin = String(suggestion.label).toLowerCase().indexOf(query.toLowerCase());
        const parts = parse(String(suggestion.label), [[matchBegin, matchBegin + query.length]]);
        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={index} style={{ fontWeight: 300 }}>
                                {part.text}
                            </span>
                        ) : (
                            <strong key={index} style={{ fontWeight: 500 }}>
                                {part.text}
                            </strong>
                        );
                    })}
                </div>
            </MenuItem>
        );
    }

    renderSuggestionsContainer(options) {
        const { containerProps, children } = options;
        return (
            <Paper
                {...containerProps}
            >
                {children}
            </Paper>
        );
    }

    render() {
        const { classes, onChange, maxSearchResults, openOnFocus, onSuggestionSelected, suggestions, value, ...otherProps } = this.props;
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={this.renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                onSuggestionSelected={this.handleSuggestionSelected}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                shouldRenderSuggestions={this.handleShouldRenderSuggestions}
                inputProps={{
                    onChange: this.handleChange,
                    value: (value || ''),
                    ...otherProps,
                }}
            />
        );
    }
}

export default withStyles(styles)(AutoComplete);
