const React = require('react');
const deepEqual = require('deep-equal');

import NotificationActions from 'actions/NotificationActions';

import CircularProgress from 'material-ui/CircularProgress';
import Center from 'app/components/Center.jsx';

/*
DataLoader component should be the only one to directly use ModelStores.
The code in `DataLoader` will take care of data loading and refreshing on store update.
It will also replace content by a loading content that you can customize with `loadingContent`.
Data loaded by stores will be given via the `onChange` attribute.

```
import DataLoader from "app/components/DataLoader.jsx";

export default class YourComponent extends React.Component {
    <DataLoader
        filters={ new Map([
            // Get teams in the group bar
            ['Team', {group: 'bar'}],
            // get user from found teams
            ['User', (datastore) => {id: datastore.Team.map(team => team.id)} ],
        ])}
        onChange={datastore => this.setState({datastore}) }
    >
        {() => (
            Put here content that require data and will be rendered only if data is available.
        )}
    </DataLoader>
    }
}
```

As you can see, filters is a `Map` list of `filters` name of store without 'Store' as key (eg: `User` for `UserStore`).

The value can be two things:

* A simple and fixed filter value that can be understand by stores. Dont use
`state` and `props` value in this type of filter because it will not get updated.
* A function with `datastore` as argument that return filters for the store. `datastore` is
the list of store content already fetched and filtered. Use this when you need
filters that change according to result of other filters.

You might have seen that we don't use a simple object, but a `Map` object. We use
it exactly the same way, but the difference is that properties order in objects
is not guaranteed. In map, the order is guaranteed and we need this because some
filters depends on other store result. In our precedent exemple,
`User` filter need `Team` ids, so the order matters.

We also put `{() => ( )}` around children of `DataLoader`. This is optional but if
you want the data inside to be evaluated only when data is available you have to do that.

`onChange` will be triggered each time all stores have been updated. `DataLoader`
will try to reduce number of `onChange` at minimum so you can rerender on every `onChange`.
`onChange` take a function with `datastore` as parameter. This parameter will have the following format

```
datastore = {
    StoreName: [
        entry1, entry2, entry3
    ],
    // example with UserStore (partial value)
    User: [
        {name: 'Bob Smith', login: 'smithbob'}
        {name: 'John Doe', login: 'doejohn'}
    ],
    // An empty example with TeamStore
    Team: [],
}
*/

/**
 * Will load data to store according to filters and render only if data is available.
 * If not available, it will render a loading content.
 * @param {Map} filters A Map list of filters indexed by store name (without -Store)
 * @param {function(datastore)} onChange Will be triggered when data is available or change
 * @param {text|DomElement} loadingContent Content that will be shown when data is not available (default to 'Chargement..')
 */
export default class DataLoader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Show loading content if true
            loading: true,
        };

        // Will hold tokens from stores to be able to unrequire data
        this.tokens = {};

        // List of used stores indexed by Model name
        this.stores = {};

        // Hold data read from stores
        this._datastore = {};

        // Children cache: Children function is executed only once when data is available
        this.childrenCache = null;

        // Binding
        this.updateData = this.updateData.bind(this);
    }

    componentDidMount() {
        if(!this.state.loading) {
            this.setState({ loading: true });
        }
        this.requireData();
    }

    componentWillUnmount() {
        // Unlisten stores
        for (let name in this.stores) {
            this.stores[name].removeChangeListener(this.updateData);
        }

        // clear store requested filters
        for (let name in this.stores) {
            this.stores[name].unloadData(this.tokens[name]);
        }

        // Clear vars
        this.tokens = {};
        this.stores = {};
        this._datastore = {};

    }

    componentWillReceiveProps(props) {
        // If filter has changed require new data
        if(JSON.stringify(props.filters) !== JSON.stringify(this.props.filters) ) {
            this.setState({ loading: true });
            this.requireData(props);
        }
    }

    /**
     * Require data from store according to filters
     * @param {Object} props optional future props
     * @return {Promise} when requiring and store update is done
     */
    requireData(props) {
        if(!props) {
            props = this.props;
        }
        if (!(this.props.filters instanceof Map)) {
            throw new Error('Parameter `filters` of `DatalLoader` should be a `Map` object.');
        }

        // Unlisten to store changes
        for (let name in this.stores) {
            this.stores[name].removeChangeListener(this.updateData);
        }

        // Create list of fucntion that will require data from each stores and return promise
        let requireList = [];
        let datastore = {};
        props.filters.forEach((filter, name) => {
            requireList.push(() => {
                return new Promise((resolve, reject) => {
                    this.stores[name] = require('stores/' + name + 'Store');
                    if (typeof filter === 'function') {
                        filter = filter(datastore);
                    }
                    this.stores[name].loadData(filter)
                    .then(data => {
                        // ensure that last token doen't exist anymore.
                        this.stores[name].unloadData(this.tokens[name]);

                        // save the component token
                        this.tokens[name] = data.token;

                        // save the new value to datastore
                        datastore[name] = data.result;

                        // Done
                        resolve();
                    })
                    .catch(reject);
                });
            });
        })

        // Chain and start functions
        requireList.reduce((p, fn) => p.then(fn), Promise.resolve())
        .then(() => {
            // Update local datastore
            this.datastore = datastore;

            // Listen to store changes
            for (let name in this.stores) {
                this.stores[name].addChangeListener(this.updateData);
            }

            // Hide loading content
            this.setState({ loading: false });
        })
        .catch(error => NotificationActions.error('Une erreur s\'est produite pendant le chargement des données depuis le serveur', error));
    }

    /**
     * Set datastore and inform parent if necessary
     */
    set datastore(datastore) {
        this.props.onChange(datastore);
        this._datastore = datastore;
    }

    /**
     * Get datastore content
     */
    get datastore() {
        return this._datastore;
    }

    /**
     * Update data to stores content without updating filters to it
     */
    updateData() {
        let datastore = this.datastore;
        this.props.filters.forEach((filter, name) => {
            if (typeof filter === 'function') {
                filter = filter(datastore);
            }
            datastore[name] = this.stores[name].find(filter);
        });

        // Set new datastore
        this.datastore = datastore;
    }

    render() {
        // Show loading page
        if(this.state.loading) {
            if(this.props.loadingContent) {
                return this.props.loadingContent;
            }

            return (
                <Center><CircularProgress/></Center>
            );
        }

        // show children
        return (
            <div>{ typeof this.props.children === 'function' ?
                this.props.children()
                :
                this.props.children }</div>
        );
    }
}
