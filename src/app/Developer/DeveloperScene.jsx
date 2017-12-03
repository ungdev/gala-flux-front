import React from 'react';

import List, {ListItem, ListItemText} from 'material-ui/List'
import Confirm from 'app/components/Confirm.jsx'
import NotificationActions from 'actions/NotificationActions';
import DeveloperService from 'services/DeveloperService';

export default class DeveloperScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showRefreshDialog: false,
        };

        this._handleRefresh = this._handleRefresh.bind(this);
    }

    _handleRefresh() {
        NotificationActions.snackbar('Demande d\'actualisation lancée.');
        DeveloperService.refresh()
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la demande d\'actualisation des navigateurs', error);
        });
    }

    render() {
        return (
            <div>
                <List>
                    <ListItem
                        button
                        onClick={() => this.setState({showRefreshDialog: true})}
                    >
                        <ListItemText
                            primary="Actualiser les clients Flux"
                            secondary="Tout les navigateurs connectés seront redirigé vers la page d'accueil"
                        />
                    </ListItem>
                </List>

                <Confirm
                    show={this.state.showRefreshDialog}
                    no={() => this.setState({showRefreshDialog: false})}
                    yes={this._handleRefresh}
                >
                    Voulez-vous vraiment rediriger tous les utilisateurs vers la page d'accueil de Flux ?
                </Confirm>
            </div>
        );
    }
}
