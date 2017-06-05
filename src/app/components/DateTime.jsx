import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import SearchIcon from 'material-ui/svg-icons/action/search';


/**
 * Will show the french version of Datetime relative to "now" : Il y a 5 min ; 18:23 ; Hier, 18:23 : 21/05/17 18:23
 * @param {Date} date The js date object
 */
export default class DateTime extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            date: props.date ? new Date(props.date) : new Date,
        };

        this.timeout = null;
    }

    componentDidMount() {
        this.setTimeout();
    }

    componentDidUpdate() {
        this.setTimeout();
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    componentWillReceiveProps(props) {
        this.setState({ date: props.date ? new Date(props.date) : new Date });
    }

    setTimeout() {
        // Remove if already exist
        clearInterval(this.timeout);

        // If less than 5 min ago, fot the next minute
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let yesterday = new Date();
        yesterday.setHours(0, 0, 0, 0);
        yesterday.setDate(today.getDate() - 1);
        let day = new Date(this.state.date);
        day.setHours(0, 0, 0, 0);

        if(Math.abs(this.state.date.getTime() - (new Date()).getTime()) < 1000 * 60 * 5) {
            this.timeout = setTimeout(() => {
                this.forceUpdate();
            }, 61000 - (1000 * this.state.date.getSeconds()));
        }
        // else if today or yesterday, update at midnight after the next day
        else if(day.getTime() == today.getTime() || day.getTime() == yesterday.getTime()) {
            this.timeout = setTimeout(() => {
                this.forceUpdate();
            }, 24*3601*1000 - (1000 * this.state.date.getSeconds() + 60000 * this.state.date.getMinutes() + 3600000 * this.state.date.getHours()));
        }
    }

    render() {
        let text = '';
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let yesterday = new Date();
        yesterday.setHours(0, 0, 0, 0);
        yesterday.setDate(today.getDate() - 1);
        let day = new Date(this.state.date);
        day.setHours(0, 0, 0, 0);

        // If less than 1 minutes : Il y a un instant
        if(this.state.date.getTime() > ((new Date()).getTime() - 1000 * 60)) {
            text = 'Il y a un instant';
        }
        else if(this.state.date.getTime() > ((new Date()).getTime() - 1000 * 60 * 5)) {
            text = 'Il y a ' + ((new Date()).getMinutes() - this.state.date.getMinutes()) + ' min';
        }
        // else if today : hh:mm
        else if(day.getTime() == today.getTime()) {
            text = (this.state.date.getHours() < 10 ? '0':'') + this.state.date.getHours() +
            ':' + (this.state.date.getMinutes() < 10 ? '0':'') + this.state.date.getMinutes();
        }
        // else if yesterdat : Hier, hh:mm
        else if(day.getTime() == yesterday.getTime()) {
            text = 'Hier, ' + (this.state.date.getHours() < 10 ? '0':'') + this.state.date.getHours() +
            ':' + (this.state.date.getMinutes() < 10 ? '0':'') + this.state.date.getMinutes();
        }
        // else : d:MM:YY hh:mm
        else {
            text = (this.state.date.getDate() < 10 ? '0':'') + this.state.date.getDate() +
            '/' + (this.state.date.getMonth() < 10 ? '0':'') + this.state.date.getMonth() +
            '/' + (this.state.date.getYear()%100 < 10 ? '0':'') + this.state.date.getYear()%100 +
            ' ' + (this.state.date.getHours() < 10 ? '0':'') + this.state.date.getHours() +
            ':' + (this.state.date.getMinutes() < 10 ? '0':'') + this.state.date.getMinutes();
        }

        return (
            <span>
                {text}
            </span>
        );
    }
}
