import React from 'react';

import ButtonList from '../alertButtons/ButtonList.jsx';

export default class AlertButtonsPage extends React.Component {

    render() {
        const style = {
            title: {
                textAlign: "center"
            }
        };

        return (
            <div className={this.props.className}>
                <h1 style={style.title}>
                    Gestion des boutons d'alerte
                </h1>
                <ButtonList />
            </div>
        );
    }

}
