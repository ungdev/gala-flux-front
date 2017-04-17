import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class LocationSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            teams: nextProps.teams
        });
    }

    render() {
        return (
            <SelectField
                multiple={this.props.multiple}
                hintText="Emplacements"
                value={this.props.value}
                onChange={this.props.setValue}
            >
                <MenuItem
                    key={0}
                    insetChildren={true}
                    checked={this.props.multiple ? this.props.value.includes(null) : this.props.value === null}
                    value={null}
                    primaryText={"reserve"}
                />
                {
                    this.state.teams.map(team => {
                        return <MenuItem
                            key={team.id}
                            insetChildren={true}
                            checked={this.props.multiple ? this.props.value.includes(team.id) : this.props.value === team.id}
                            value={team.id}
                            primaryText={team.name}
                        />
                    })
                }
            </SelectField>
        );
    }

}