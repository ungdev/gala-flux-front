import React from 'react';

import TextField from 'material-ui/TextField';
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
        let {setValue, ...props} = this.props;
        return (
            <TextField
                select
                {...props}
            >
                <SelectableMenuItem
                    key={0}
                    value={null}
                >
                    Reserve
                </SelectableMenuItem>
                {
                    this.state.teams.map(team => {
                        return <SelectableMenuItem
                            key={team.id}
                            value={team.id}
                        >
                            {team.name}
                        </SelectableMenuItem>
                    })
                }
            </TextField>
        );
    }

}
