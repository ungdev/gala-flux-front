import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class SelectRole extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // TODO get from API
            options: [
                "bar",
                "admin",
                "log"
            ],
            selected: props.selected,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    render() {
        return (


            <SelectField
                floatingLabelText="Autorisations"
                value={this.state.selected}
                onChange={(e, index, value) => this.props.onChange(value)}
                autoWidth={false}
                required={true}
            >
                {
                    this.state.options.map((option, i) => {
                        return <MenuItem key={i} value={option} primaryText={option} />
                    })
                }
            </SelectField>
        );
    }

}
