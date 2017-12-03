import React from 'react';

import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';

import LocationSelect from 'app/Stocks/components/LocationSelect.jsx';
import SelectableMenuItem from 'app/components/SelectableMenuItem.jsx';

/**
 * @param {ModelCollection} teams
 * @param {ModelCollection} barrelTypes
 * @param {ModelCollection} bottleTypes
 * @param {function} setFilters
 * @param {Object} filters
 */
class Filters extends React.Component {

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        label="Types de fût"
                        SelectProps={{multiple:true, value: this.props.filters.types}}
                        onChange={(e) => this.props.setFilters('types', e.target.value)}
                        fullWidth
                    >
                        {
                            this.props.barrelTypes.map(type => {
                                return (<SelectableMenuItem
                                    key={type.id}
                                    value={type.id}
                                >
                                    {type.name}
                                </SelectableMenuItem>);
                            })
                        }
                        {
                            this.props.bottleTypes.map(type => {
                                return (<SelectableMenuItem
                                    key={'-'+type.id}
                                    value={'-'+type.id}
                                >
                                    {type.name}
                                </SelectableMenuItem>);
                            })
                        }
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocationSelect
                        label="Emplacements"
                        SelectProps={{multiple:true, value: this.props.filters.locations}}
                        teams={this.props.teams.findByPermission('ui/stockReceiver').sortBy('name')}
                        onChange={(e) => this.props.setFilters('locations', e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        select
                        label="Etats"
                        SelectProps={{multiple:true, value: this.props.filters.states}}
                        onChange={(e) => this.props.setFilters('states', e.target.value)}
                        fullWidth
                    >
                        <SelectableMenuItem value="new">Neuf</SelectableMenuItem>
                        <SelectableMenuItem value="opened">Entamé</SelectableMenuItem>
                        <SelectableMenuItem value="empty">Terminé</SelectableMenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Rechercher une référence"
                        value={this.props.filters.reference}
                        onChange={e => this.props.setFilters("reference", e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
        );
    }
}
export default Filters;
