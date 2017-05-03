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
                <ButtonList />
            </div>
        );
    }

}
