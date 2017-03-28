import React from 'react';

export default class SelectGroup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [
                "bar",
                "admin",
                "log",
                "orga"
            ],
            default: props.default
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ default: nextProps.default });
    }

    render() {
        return (
            <select value={this.state.default} onChange={e => this.props.onChange(e.target.value)}>
                {
                    this.state.options.map((option, i) => {
                        return  <option key={i} value={option}>
                                    {option}
                                </option>
                    })
                }
            </select>
        );
    }

}