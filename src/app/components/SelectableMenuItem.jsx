import React from 'react';

import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    selected: {
        color: theme.palette.secondary['A200'],
    },
});


/**
 * Exactly the same as a MenuItem excepte that it has a selected field to mark it as selected
 * @param [boolean] selected
 */
class SelectableMenuItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: props.selected
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected
        });
    }

    render() {
        var { selected, selected, ...props } = this.props;
        props.className = (props.className ? props.className + ' ' : '') + (this.state.selected ? this.props.classes.selected : '');

        return (
                <MenuItem {...props} />
        );
    }

}
export default withStyles(styles)(SelectableMenuItem);
