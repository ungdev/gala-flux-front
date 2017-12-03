import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxHeight: '100%',
        overflow: 'hidden',
    },
});

/**
 * Page part container that will split the main area into vertical scrollable area
 * Every attributes will be transmitted to the underlying div
 */
class Page extends React.Component {
    render() {
        let {classes, className, ...props} = this.props;
        return (
            <div className={classes.root + ' ' + className}>
                {this.props.children}
            </div>
        );
    }
}
export default withStyles(styles)(Page);
