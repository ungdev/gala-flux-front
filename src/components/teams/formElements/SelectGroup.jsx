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
            selected: props.selected
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selected: nextProps.selected });
    }

    render() {
        return (
            <select value={this.state.selected} onChange={e => this.props.onChange(e.target.value)}>
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