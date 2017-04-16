import React, {Component} from 'react';

import {List, makeSelectable} from 'material-ui/List';


/**
 * This component is a selectable list with the given params
 * - value
 * - onChange(value)
 * Note: you have to set a value to your ListItem
 */


let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {

        constructor(props) {
            super(props);

            this._handleRequestChange = this._handleRequestChange.bind(this);
        }

        componentWillMount() {
            this.setState({
                value: this.props.value,
            });
        }

        componentWillReceiveProps(nextProps) {
            this.setState({
                value: nextProps.value
            });
        }

        _handleRequestChange(event, value) {
            this.setState({
                value: value,
            });

            if(this.props.onChange) {
                this.props.onChange(value);
            }
        };

        render() {
            return (
                <ComposedComponent
                    value={this.state.value}
                    onChange={this._handleRequestChange}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}
SelectableList = wrapState(SelectableList);

export default SelectableList;
