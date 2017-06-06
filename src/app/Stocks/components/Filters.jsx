import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import LocationSelect from 'app/Stocks/components/LocationSelect.jsx';

/**
 * @param {ModelCollection} teams
 * @param {ModelCollection} barrelTypes
 * @param {ModelCollection} bottleTypes
 * @param {function} setFilters
 * @param {Object} filters
 */
export default class Filters extends React.Component {

    render() {
        return (
            <Row>
                <Col xs={12} sm={6} md={3}>
                    <SelectField
                        multiple={true}
                        hintText="Types de fût"
                        value={this.props.filters.types}
                        onChange={(e, i, v) => this.props.setFilters("types", v)}
                        fullWidth={true}
                    >
                        {
                            this.props.barrelTypes.map(type => {
                                return <MenuItem
                                    key={type.id}
                                    insetChildren={true}
                                    checked={this.props.filters.types.includes(type.id)}
                                    value={type.id}
                                    primaryText={type.name}
                                />
                            })
                        }
                        {
                            this.props.bottleTypes.map(type => {
                                return <MenuItem
                                    key={'-'+type.id}
                                    insetChildren={true}
                                    checked={this.props.filters.types.includes('-'+type.id)}
                                    value={'-'+type.id}
                                    primaryText={type.name}
                                />
                            })
                        }
                    </SelectField>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <LocationSelect
                        teams={this.props.teams.findByPermission('ui/stockReceiver').sortBy('name')}
                        value={this.props.filters.locations}
                        setValue={(e, i, v) => this.props.setFilters("locations", v)}
                        multiple={true}
                    />
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <SelectField
                        multiple={true}
                        hintText="Etats"
                        value={this.props.filters.states}
                        onChange={(e, i, v) => this.props.setFilters("states", v)}
                        fullWidth={true}
                    >
                        <MenuItem insetChildren={true} checked={this.props.filters.states.includes("new")} value={"new"} primaryText={"Neuf"} />
                        <MenuItem insetChildren={true} checked={this.props.filters.states.includes("opened")} value={"opened"} primaryText={"Entamé"} />
                        <MenuItem insetChildren={true} checked={this.props.filters.states.includes("empty")} value={"empty"} primaryText={"Terminé"} />
                    </SelectField>
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
