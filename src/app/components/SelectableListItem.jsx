import React from 'react';

import { ListItem } from 'material-ui/List';


/**
 * Exactly the same as a ListItem excepte that it is made to be selected in a SelectableList
 * @param [boolean] selected
 */
class SelectableListItem extends React.Component {

    render() {
        var { ...props } = this.props;
        props.button = true;
        props.className = (props.className ? props.className + ' ' : '') + 'SelectableListItem';

        return (
                <ListItem {...props} />
        );
    }

}
export default SelectableListItem;
