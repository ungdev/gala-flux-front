import React from 'react';

import Input, { InputLabel } from 'material-ui/Input';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    root: {
        width: '100%',
        textAlign: 'left',
    },
});


/**
 * @param {Array} teams List of teams to show
 * @param {Array} value List of teams selected
 * @param {function(value)} onChange Will be called on value change
 */
class ReceiverSelect extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <Select
                multiple
                value={this.props.value}
                onChange={(e) => this.props.onChange(e.target.value)}
                placeholder="Destinataire"
                input={<Input id="name-multiple" />}
                className={classes.root}
            >
                <SelectableMenuItem
                    key={0}
                    selected={this.props.value && this.props.value.includes(null)}
                    value={null}
                >
                    Alertes auto
                </SelectableMenuItem>
                {
                    this.props.teams.map(team => {
                        return <SelectableMenuItem
                                key={team.id}
                                selected={this.props.value && this.props.value.includes(team.id)}
                                value={team.id}
                            >
                            {team.name}</SelectableMenuItem>
                    })
                }
            </Select>
        );
    }
}
export default withStyles(styles)(ReceiverSelect);
