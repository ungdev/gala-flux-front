import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TeamStore from 'stores/TeamStore';

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
                hintText={this.props.multiple && "Emplacements"}
                value={this.props.value}
                onChange={this.props.setValue}
                fullWidth={true}
                floatingLabelFixed={this.props.floatingLabel != null}
                floatingLabelText={this.props.floatingLabel ? this.props.floatingLabel : null}
            >
                <MenuItem
                    key={0}
                    insetChildren={true}
                    checked={this.props.multiple ? this.props.value.includes(null) : this.props.value === null}
                    value={null}
                    primaryText={"Reserve"}
                />
                {
                    TeamStore.teams.map(team => {
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
