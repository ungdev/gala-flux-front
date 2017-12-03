import React from 'react';
import { withStyles } from 'material-ui/styles';
import PagePart from 'app/components/PagePart.jsx';

const styles = theme => ({
    root: {
        width: '1px',
        maxWidth: '1px',
        minWidth: '1px',
        height: '100%',
        backgroundColor: theme.palette.common.minBlack,
    },
});

/**
 * Act as a page part except that it is 1px wide and has a colored background
 * @param {bool} main If false the block will be hidden when the given breakpoint is reached (default: true)
 * @param {string} breakpoint Breakpoint at which this element will be hidden if not "main". (default: sm)
 * Every attributes will be transmitted to the underlying div
 */
class PagePartSeparator extends React.Component {
    render() {
        let {classes, className, ...props} = this.props;
        return (
            <PagePart {...props} className={classes.root + ' ' + (className || '')}/>
        );
    }
}
export default withStyles(styles)(PagePartSeparator);
