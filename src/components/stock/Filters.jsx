import React from 'react';

import { Row, Col } from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import TeamStore from 'stores/TeamStore';
import LocationSelect from 'components/stock/LocationSelect.jsx';

export default class Filters extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrelTypes: props.barrelTypes,
            bottleTypes: props.bottleTypes,
            filters: props.filters
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            barrelTypes: props.barrelTypes,
            bottleTypes: props.bottleTypes,
            filters: props.filters
        });
    }

    render() {
        return (
            <Row>
                <Col xs={12} sm={6} md={3}>
                    <SelectField
                        multiple={true}
                        hintText="Types de fût"
                        value={this.state.filters.types}
                        onChange={(e, i, v) => this.props.setFilters("types", v)}
                        fullWidth={true}
                    >
                        {
                            this.state.barrelTypes.map(type => {
                                return <MenuItem
                                    key={type.id}
                                    insetChildren={true}
                                    checked={this.state.filters.types.includes(type.id)}
                                    value={type.id}
                                    primaryText={type.name}
                                />
                            })
                        }
                        {
                            this.state.bottleTypes.map(type => {
                                return <MenuItem
                                    key={'-'+type.id}
                                    insetChildren={true}
                                    checked={this.state.filters.types.includes('-'+type.id)}
                                    value={'-'+type.id}
                                    primaryText={type.name}
                                />
                            })
                        }
                    </SelectField>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <LocationSelect
                        teams={TeamStore.findByPermission('ui/receiveStock')}
                        value={this.state.filters.locations}
                        setValue={(e, i, v) => this.props.setFilters("locations", v)}
                        multiple={true}
                    />
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <SelectField
                        multiple={true}
                        hintText="Etats"
                        value={this.state.filters.states}
                        onChange={(e, i, v) => this.props.setFilters("states", v)}
                        fullWidth={true}
                    >
                        <MenuItem insetChildren={true} checked={this.state.filters.states.includes("new")} value={"new"} primaryText={"Neuf"} />
                        <MenuItem insetChildren={true} checked={this.state.filters.states.includes("opened")} value={"opened"} primaryText={"Entamé"} />
                        <MenuItem insetChildren={true} checked={this.state.filters.states.includes("empty")} value={"empty"} primaryText={"Terminé"} />
                    </SelectField>
                </Col>

                <Col xs={12} sm={6} md={3}>
                    <TextField
                        hintText="Rechercher une référence"
                        value={this.state.filters.reference}
                        onChange={e => this.props.setFilters("reference", e.target.value)}
                        fullWidth={true}
                    />
                </Col>
            </Row>
        );
    }

}
