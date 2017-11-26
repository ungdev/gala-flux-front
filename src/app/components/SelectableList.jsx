import React, {Component} from 'react';

import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    selected: {
        backgroundColor: theme.palette.common.minBlack,
    }
});

/**
 * This component is a selectable list with the given params
 * - value
 * - onChange(value)
 * Note: you have to set a value to your ListItem and change their style yourself
 */
 class SelectableList extends React.Component {

     constructor(props) {
         super(props);
         
         this.state = {
             value: props.value,
         }

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

     _handleRequestChange(value) {
         this.setState({
             value: value,
         });

         if(this.props.onChange) {
             this.props.onChange(value);
         }
     };

     render() {
         const { classes } = this.props;
         return (
             <List>{
                React.Children.map(this.props.children, (Child, i) => {
                    if (Child.type === ListItem) {
                        // Add click handler on each ListItem Children
                        let props = Object.assign({}, Child.props);
                        props.onClick = () => {
                            this._handleRequestChange(props.value);
                        }
                        // If value it the same as current value add the select class
                        if(props.value == this.state.value) {
                            props.className += ' ' + classes.selected;
                        }
                        // Force ListItem as a button
                        props.button = true;
                        return React.createElement(Child.type, props);
                    }
                    return child
                })
            }</List>
         );
     }
 }
 export default withStyles(styles)(SelectableList);


