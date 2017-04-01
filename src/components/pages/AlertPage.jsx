import React from 'react';

import ButtonList from '../alertButtons/ButtonList.jsx';
import ButtonForm from '../alertButtons/ButtonForm.jsx';

export default class AlertPage extends React.Component {

    render() {
        return (
            <div>
                <ButtonForm />
                <ButtonList />
            </div>
        );
    }

}