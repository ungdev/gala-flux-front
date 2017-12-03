import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    selected: {
        backgroundColor: theme.palette.common.minBlack,
    }
});

/**
* This component is a selectable list with the given params
* Note: you have to set a value to your ListItem and change their style yourself
* @param {string} value Value to select
* @param {function(value)} onChange  called when a new item is selected
* @param {function(value)} isSelected Optionnal callback used to check if a value
* is selected. This let you select multiple items or item that doesn't exactly
* match the value.
*/
class SelectableList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        }

        this.handleRequestChange = this.handleRequestChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            value: this.props.value,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        });
    }

    handleRequestChange(e) {
        // Iterate of parent tree to find our element that contains the value
        let target = e.target;
        while(!target.className.includes('SelectableListItem')) {
            target = target.parentNode;
        }

        this.setState({
            value: target.getAttribute('value'),
        });

        if(this.props.onChange) {
            this.props.onChange(target.getAttribute('value'));
        }
    };


    componentDidUpdate() {
        this.updateListItemChildren();
    }

    componentDidMount() {
        this.updateListItemChildren();
    }

    componentWillUnmount() {
        if(this.animationFrameId) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }

    updateListItemChildren() {
        this.animationFrameId = window.requestAnimationFrame(() => {
            let itemList = ReactDOM.findDOMNode(this).getElementsByClassName('SelectableListItem');
            for(let item of itemList) {
                // Add click handler on each ListItem Children
                item.removeEventListener('click', this.handleRequestChange);
                item.addEventListener('click', this.handleRequestChange);

                // If value it the same as current value add the select class
                if(item.getAttribute('value') == this.state.value || (this.props.isSelected && this.props.isSelected(item.getAttribute('value')))) {
                    item.className = item.className.replace(' ' + this.props.classes.selected, '');
                    item.className += ' ' + this.props.classes.selected;
                }
                else {
                    item.className = item.className.replace(' ' + this.props.classes.selected, '');
                }
            }
        })
    }



    render() {
        const { classes } = this.props;
        return (
            <List>{this.props.children}</List>
        );
    }
}
export default withStyles(styles)(SelectableList);
