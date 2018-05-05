import React from 'react';

import TeamStore from 'stores/TeamStore';
import NotificationActions from 'actions/NotificationActions';
import PreferencesStore from 'stores/PreferencesStore';
import UserService from 'services/UserService';

import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';
import DataLoader from 'app/components/DataLoader.jsx';
import NotificationConfigRow from 'app/Layout/components/NotificationConfigRow.jsx';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import Divider from 'material-ui/Divider';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import List, {  ListItem,  ListItemIcon,  ListItemSecondaryAction,  ListItemText,  ListSubheader } from 'material-ui/List';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import NotificationsIcon from 'material-ui-icons/Notifications';
import NotificationsOffIcon from 'material-ui-icons/NotificationsOff';
import VisibilityOffIcon from 'material-ui-icons/VisibilityOff';

const styles = theme => ({
    radioHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    radioHeaderIcon: {
        display: 'flex',
        width: '48px',
        height: '48px',
        justifyContent: 'center',
        alignItems: 'center',
    }
});



class PreferencesDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            preferences: null,
        };

        // binding
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
    }

    componentWillMount() {
        // init the notifications object in the state
        this.setNotificationsConfiguration();
    }

    /**
     * Update the notifications in the component state with the values from PreferencesStore
     */
    setNotificationsConfiguration() {
        this.setState({ preferences: Object.assign({}, PreferencesStore.preferences) });
    }

    /**
     * Update the notification parameters in the localStorage
     */
    handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        // Submit
        UserService.setPreferences(this.state.preferences)
        .then((preferences) => {
            this.props.close();
            NotificationActions.snackbar('Vos préférences ont bien été enregistrées.');
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant la sauvegarde de fos préférences', error);
        });
    }

    /**
     * Toggle the value of a parameter of the notifications configuration
     *
     * @param {string} parameter: the parameter to toggle
     */
    handleToggle(parameter) {
        let preferences = this.state.preferences;
        preferences.notifications[parameter] = !preferences.notifications[parameter];
        this.setState({ preferences });
    }

    /**
     * Set param on a channel
     */
    handleChannelChange(channel, value) {
        let preferences = this.state.preferences;
        preferences.notifications.channels[channel] = value;
        this.setState({ preferences })
    }

    /**
     * Set param on an alert
     */
    handleAlertChange(teamId, value) {
        let preferences = this.state.preferences;
        preferences.notifications.alerts[teamId] = value;
        this.setState({ preferences })
    }

    render() {
        const {classes} = this.props;
        return (
            <Dialog
                open={true}
                onRequestClose={this.props.close}
            >
                <DialogTitle>Préférences utilisateur</DialogTitle>
                <DialogContent>
                    <p>Vous pouvez modifier vos préférences utilisateur. Ces options de notifications sont associés à votre compte et seront donc utilisé sur tous les périphériques où vous êtes connectés</p>
                    <List>
                        <ListItem>
                            <ListItemText primary="Activer les notifications" secondary="Permet de activer/désactiver toutes les notifications"/>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={_ => this.handleToggle('enable')}
                                    checked={this.state.preferences.notifications.enable}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        { !global.Android ?
                            <div>
                                <ListItem>
                                    <ListItemText primary="Son" secondary="Jouer un son lors des notifications"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            disabled={this.state.preferences.notifications.enable === false}
                                            onChange={_ => this.handleToggle('sound')}
                                            checked={this.state.preferences.notifications.sound}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Écran clignotant" secondary="Faire clignoter l'écran lors des notifications"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            disabled={this.state.preferences.notifications.enable === false}
                                            onChange={_ => this.handleToggle('flash')}
                                            checked={this.state.preferences.notifications.flash}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Notifications pour bureau" secondary="Recevoir les notifications sur votre bureau"/>
                                    <ListItemSecondaryAction>
                                        <Switch
                                            disabled={this.state.preferences.notifications.enable === false}
                                            onChange={_ => this.handleToggle('desktop')}
                                            checked={this.state.preferences.notifications.desktop}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </div>
                        :
                            <ListItem
                            >
                                <ListItemText primary="Notifications Android" secondary="Recevoir des notifications Android"/>
                                <ListItemSecondaryAction>
                                    <Switch
                                        disabled={this.state.preferences.notifications.enable === false}
                                        onChange={_ => this.handleToggle('android')}
                                        checked={this.state.preferences.notifications.android}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        }
                    </List>

                    <Typography type="title" gutterBottom>
                        Paramètres des notification d'alertes
                    </Typography>
                    <div>
                        <DataLoader
                            filters={new Map([
                                ['Team', {id: Object.keys(this.state.preferences.notifications.alerts).filter(v => (v != 'null'))}],
                            ])}
                            onChange={() => this.forceUpdate()}
                        >
                            <div>
                                <div className={classes.radioHeader}>
                                    <Tooltip placement="bottom" className={classes.radioHeaderIcon} title="Ne pas notifier"><NotificationsOffIcon/></Tooltip>
                                    <Tooltip placement="bottom" className={classes.radioHeaderIcon} title="Notifier pour chaque alerte"><NotificationsIcon/></Tooltip>
                                </div>
                                <Divider/>
                            </div>
                            {Object.keys(this.state.preferences.notifications.alerts).sort((a,b) => a.localeCompare(b)).map((teamId) => {
                                let team = TeamStore.findById(teamId);
                                return (
                                    <NotificationConfigRow
                                        key={teamId}
                                        label={(team ? team.name : 'Alertes automatiques')}
                                        onChange={v => this.handleAlertChange(teamId, v)}
                                        value={this.state.preferences.notifications.alerts[teamId]}
                                        disabled={this.state.preferences.notifications.enable === false}
                                        hiddenOption={false}
                                    />
                                )})
                            }
                            <div>
                                <div className={classes.radioHeader}>
                                    <Tooltip placement="top" className={classes.radioHeaderIcon} title="Ne pas notifier"><NotificationsOffIcon/></Tooltip>
                                    <Tooltip placement="top" className={classes.radioHeaderIcon} title="Notifier pour chaque alerte"><NotificationsIcon/></Tooltip>
                                </div>
                            </div>
                        </DataLoader>
                    </div>

                    <Typography type="title" gutterBottom>
                        Paramètres des channels
                    </Typography>
                    <div>
                        <div>
                            <div className={classes.radioHeader}>
                                <Tooltip placement="bottom" className={classes.radioHeaderIcon} title="Cacher ce channel"><VisibilityOffIcon/></Tooltip>
                                <Tooltip placement="bottom" className={classes.radioHeaderIcon} title="Ne pas notifier"><NotificationsOffIcon/></Tooltip>
                                <Tooltip placement="bottom" className={classes.radioHeaderIcon} title="Notifier pour chaque messages"><NotificationsIcon/></Tooltip>
                            </div>
                            <Divider/>
                        </div>
                        {
                            Object.keys(this.state.preferences.notifications.channels).sort((a,b) => a.replace('public:','0:').localeCompare(b.replace('public:','0:'))).map((channel) => {
                                return (
                                    <NotificationConfigRow
                                        key={channel}
                                        label={channel}
                                        onChange={v => this.handleChannelChange(channel, v)}
                                        value={this.state.preferences.notifications.channels[channel]}
                                        disabled={this.state.preferences.notifications.enable === false}
                                    />
                                )
                            })
                        }
                    </div>
                    <div>
                        <div className={classes.radioHeader}>
                            <Tooltip placement="top" className={classes.radioHeaderIcon} title="Cacher ce channel"><VisibilityOffIcon/></Tooltip>
                            <Tooltip placement="top" className={classes.radioHeaderIcon} title="Ne pas notifier"><NotificationsOffIcon/></Tooltip>
                            <Tooltip placement="top" className={classes.radioHeaderIcon} title="Notifier pour chaque messages"><NotificationsIcon/></Tooltip>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="accent"
                        onTouchTap={this.props.close}
                    >
                        Annuler
                    </Button>
                    <Button
                        color="primary"
                        onTouchTap={this.handleSubmit}
                    >
                        Valider
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withStyles(styles)(PreferencesDialog);
