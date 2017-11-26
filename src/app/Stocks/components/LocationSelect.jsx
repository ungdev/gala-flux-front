import React from 'react';

import Select from 'material-ui/Select';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';

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
            <Select
                multiple
                placeholder={this.props.multiple && "Emplacements"}
                value={this.props.value}
                onChange={(e) => {this.props.setValue && this.props.setValue(e.target.value)}}
                floatingLabelFixed={this.props.floatingLabel != null}
                label={this.props.floatingLabel ? this.props.floatingLabel : null}
            >
                <SelectableMenuItem
                    key={0}
                    selected={this.props.multiple ? this.props.value.includes(null) : this.props.value === null}
                    value={null}
                >
                    Reserve
                </SelectableMenuItem>
                {
                    this.state.teams.map(team => {
                        return <SelectableMenuItem
                            key={team.id}
                            selected={this.props.multiple ? this.props.value.includes(team.id) : this.props.value === team.id}
                            value={team.id}
                        >
                            {team.name}
                        </SelectableMenuItem>
                    })
                }
            </Select>
        );
    }

}
