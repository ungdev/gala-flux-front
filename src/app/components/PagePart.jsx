import React from 'react';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';

const styles = theme => ({
    container: {
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
    },
});

/**
 * Page part to use inside Page to split the main area into vertical scrollable area
 * @param {bool} main If false the block will be hidden when the given breakpoint is reached (default: true)
 * @param {string} breakpoint Breakpoint at which this element will be hidden if not "main". (default: sm)
 * Every attributes will be transmitted to the underlying div
 */
class PagePart extends React.Component {
    render() {
        let {classes, className, main, breakpoint, ...props} = this.props;
        let hiddenProps = {};
        if(main === false) {
            switch(breakpoint) {
                case 'xl': hiddenProps.xlDown = true; break;
                case 'lg': hiddenProps.lgDown = true; break;
                case 'md': hiddenProps.mdDown = true; break;
                case 'xs': hiddenProps.xsDown = true; break;
                default: hiddenProps.smDown = true; break;
            }
        }

        return (
            <Hidden {...hiddenProps}>
                <div {...props} className={classes.container + ' ' + (className || '')}/>
            </Hidden>
        );
    }
}
export default withStyles(styles)(PagePart);
