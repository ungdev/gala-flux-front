import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


/**
 * @param {Array} teams List of teams to show
 * @param {Array} value List of teams selected
 * @param {function(value)} onChange Will be called on value change
 */
export default class ReceiverSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teams: props.teams
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            teams: nextProps.teams
        });
    }

    _handleChange(e, i, v) {
        if(this.props.onChange) {
            this.props.onChange(v);
        }
    }

    render() {
        return (
            <SelectField
                multiple={true}
                hintText="Destinataire"
                value={this.props.value}
                onChange={this._handleChange}
                fullWidth={true}
            >
                <MenuItem
                    key={0}
                    insetChildren={true}
                    checked={this.props.value && this.props.value.includes(undefined)}
                    value={undefined}
                    primaryText="Alertes auto"
                />
                {
                    this.state.teams.map(team => {
                        return <MenuItem
                            key={team.id}
                            insetChildren={true}
                            checked={this.props.value && this.props.value.includes(team.id)}
                            value={team.id}
                            primaryText={team.name}
                        />
                    })
                }
            </SelectField>
        );
    }

}
