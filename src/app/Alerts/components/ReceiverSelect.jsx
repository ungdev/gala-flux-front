import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


/**
 * @param {Array} teams List of teams to show
 * @param {Array} value List of teams selected
 * @param {function(value)} onChange Will be called on value change
 */
export default class ReceiverSelect extends React.Component {

    render() {
        return (
            <SelectField
                multiple={true}
                hintText="Destinataire"
                value={this.props.value}
                onChange={(e,i,v) => this.props.onChange(v)}
                fullWidth={true}
            >
                <MenuItem
                    key={0}
                    insetChildren={true}
                    checked={this.props.value && this.props.value.includes(null)}
                    value={null}
                    primaryText="Alertes auto"
                />
                {
                    this.props.teams.map(team => {
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
