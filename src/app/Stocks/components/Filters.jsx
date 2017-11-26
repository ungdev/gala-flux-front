import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
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
            <Row>
                <Col xs={12} sm={6} md={3}>
                    <Select
                        multiple
                        placeholder="Types de fût"
                        value={this.props.filters.types}
                        onChange={(e) => this.props.setFilters("types", e.target.value)}
                    >
                        {
                            this.props.barrelTypes.map(type => {
                                return <SelectableMenuItem
                                    key={type.id}
                                    selected={this.props.filters.types.includes(type.id)}
                                    value={type.id}
                                >
                                    {type.name}
                                </SelectableMenuItem>
                            })
                        }
                        {
                            this.props.bottleTypes.map(type => {
                                return <SelectableMenuItem
                                    key={'-'+type.id}
                                    selected={this.props.filters.types.includes('-'+type.id)}
                                    value={'-'+type.id}
                                >
                                    {type.name}
                                </SelectableMenuItem>
                            })
                        }
                    </Select>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <LocationSelect
                        teams={this.props.teams.findByPermission('ui/stockReceiver').sortBy('name')}
                        value={this.props.filters.locations}
                        setValue={(v) => this.props.setFilters("locations", v)}
                        multiple={true}
                    />
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <Select
                        multiple
                        placeholder="Etats"
                        value={this.props.filters.states}
                        onChange={(e) => this.props.setFilters('states', e.target.value)}
                    >
                        <SelectableMenuItem selected={this.props.filters.states.includes("new")} value="new">Neuf</SelectableMenuItem>
                        <SelectableMenuItem selected={this.props.filters.states.includes("opened")} value="opened">Entamé</SelectableMenuItem>
                        <SelectableMenuItem selected={this.props.filters.states.includes("empty")} value="empty">Terminé</SelectableMenuItem>
                    </Select>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <TextField
                        hintText="Rechercher une référence"
                        value={this.props.filters.reference}
                        onChange={e => this.props.setFilters("reference", e.target.value)}
                        fullWidth={true}
                    />
                </Col>
            </Row>
        );
    }
}
export default Filters;
