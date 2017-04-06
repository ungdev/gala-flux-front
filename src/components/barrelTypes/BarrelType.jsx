import React from 'react';

import { ListItem } from 'material-ui/List';
import Launch from 'material-ui/svg-icons/action/launch';
import Edit from 'material-ui/svg-icons/image/edit';

export default class BarrelType extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: props.type
        };
    }

    render() {

        return (
            <div>
                <ListItem
                    leftIcon={<Edit onClick={_ => this.props.edit(this.state.type)} />}
                    rightToggle={<Launch onClick={_ => this.props.show(this.state.type)} />}
                    primaryText={this.state.type.name}
                />
            </div>
        );
    }

}