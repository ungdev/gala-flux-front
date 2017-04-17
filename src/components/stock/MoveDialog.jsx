import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class MoveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barrels: props.barrels,
            teams: props.teams
        };

        // binding
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barrels: nextProps.barrels,
            teams: nextProps.teams
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const actions = [
            <FlatButton
                label="Déplacer"
                primary={true}
            />,
            <FlatButton
                label="Annuler"
                secondary={true}
                onClick={this.props.close}
            />
        ];

        return (
            <div>
                {
                    this.state.barrels && this.state.teams &&
                    <Dialog
                        title={"Déplacement de fûts"}
                        open={this.props.show}
                        modal={true}
                        onRequestClose={this.props.close}
                        actions={actions}
                    >
                        {
                            this.state.barrels.map(barrel => {
                                return barrel.reference
                            }).join(', ')
                        }
                    </Dialog>
                }
            </div>
        );
    }

}
