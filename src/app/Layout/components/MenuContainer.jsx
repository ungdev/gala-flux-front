import React from 'react';
import { browserHistory } from 'react-router'

import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';
import SelectableList from 'app/components/SelectableList.jsx';

const styles = theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            height: theme.custom.appBarHeightXs,
        },
    },
});


/**
 * Should have MenuItem as childrens.
 * The value of thoses items will be used as route on click
 * The attribute data-notification-count and class NotificationScrollIndicatorLine
 * will be used to show notifications which are not on screen
  * @param {Object} router react-router router object
  * @param {function(value)} onChange Called when a new route is selected
 */
class MenuContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: decodeURI(this.props.router.getCurrentLocation().pathname),
            overNewMessageCount: 0,
            underNewMessageCount: 0,
        };

        // binding
        this.handleScroll = this.handleScroll.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount() {
        this.unlisten = this.props.router.listen(this.handleRouteChange);
    }

    componentWillUnmount() {
        // Remove route listener
        if(this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }
    }

    componentDidUpdate() {
        this.handleScroll();
    }

    /**
     * Re-render when the route change
     * @param route
     */
    handleRouteChange(currentLocation) {
        this.setState({
            route: decodeURI(currentLocation.pathname),
        });
    }

    handleSelection(route) {
        if(route != this.state.route) {
            browserHistory.push(route);
            if(this.props.onChange) {
                this.props.onChange(route);
            }
        }
    }

    handleScroll(e) {
    //     let target = this.scrollArea;
    //     if(target) {
    //         let over = 0;
    //         let under = 0;
    //
    //         const scrollAreaTop = target.getBoundingClientRect().top;
    //         const scrollAreaBottom = target.getBoundingClientRect().bottom;
    //
    //         // Calculate number of message under and over the view in the scroll area
    //         let elements = target.getElementsByClassName('NotificationScrollIndicatorLine');
    //         for (let i = 0 ; i < elements.length ; i++) {
    //             let el = elements[i];
    //             let rect = el.getBoundingClientRect();
    //             if(el.dataset && el.dataset.count && rect && rect.bottom != 0) {
    //                 if(rect.top - scrollAreaTop < 0) {
    //                     over += parseInt(el.dataset.count) || 0;
    //                 }
    //                 else if(scrollAreaBottom - rect.bottom < 0) {
    //                     under += parseInt(el.dataset.count) || 0;
    //                 }
    //             }
    //         }
    //
    //         // update state if necessary
    //         let state = {};
    //         if(this.state.overNewMessageCount != over) {
    //             state.overNewMessageCount = over;
    //         }
    //         if(this.state.underNewMessageCount != under) {
    //             state.underNewMessageCount = under;
    //         }
    //         if(Object.keys(state) != 0) {
    //             this.setState(state);
    //         }
    //     }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                {this.state.overNewMessageCount != 0 &&
                    <div className="NotificationScrollIndicator--top">
                        <div>
                            {this.state.overNewMessageCount} Non lus ↑
                        </div>
                    </div>
                }
                <SelectableList
                    onChange={this.handleSelection}
                    isSelected={(v) => this.props.router.isActive(v)}
                >
                    {this.props.children}
                </SelectableList>
                {this.state.underNewMessageCount != 0 &&
                    <div className="NotificationScrollIndicator--bottom">
                        <div>
                            {this.state.underNewMessageCount} Non lus ↓
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(MenuContainer);
