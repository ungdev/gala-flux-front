import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

export default class BarBarrel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            typeName: props.typeName,
            barrel: props.barrel,
            color: props.color
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            typeName: nextProps.typeName,
            barrel: nextProps.barrel
        });
    }

    render() {
        const barrelState = this.state.barrel.state;

        const styles = {
            avatar: {
                fontSize: "11px",
                marginRight: 5,
                background: this.state.color
            },
            container: {
                marginBottom: 4
            }
        };

        // dynamic attributes, depending of the barrel state
        const allowedActions = {};
        if (barrelState === "new" || barrelState === "opened") {
            allowedActions.onTouchTap = _ => this.props.moveNextState(this.state.barrel);
        }
        if (barrelState === "empty" || barrelState === "opened") {
            allowedActions.onRequestDelete = _ => this.props.backPreviousState(this.state.barrel);
        }

        return (
            <Chip
                style={styles.container}
                {...allowedActions}
            >
                <Avatar style={styles.avatar}>
                    {this.state.barrel.reference}
                </Avatar>

                {this.state.typeName}
            </Chip>
        );
    }

}