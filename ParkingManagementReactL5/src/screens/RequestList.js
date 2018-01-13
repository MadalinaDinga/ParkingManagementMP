import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicator,
    TouchableNativeFeedback,
    AsyncStorage,
} from 'react-native';
import RequestsAPI from "../api/RequestsApi";
import {Button} from 'react-native-elements';
import {getLogger} from "../common/utils";

const listData = [
    {id:1, type: "Parking Spot Rental", requestedAt: "10:22 / 19.09.2016", period: "13.10.16 - 14.10.16", requestedFor: "Raul SABOU", createdBy: "Raul SABOU", requestedFrom: "Mihai ENACHE", status: "Approved"},
    {id:2, type: "Parking Spot Rental", requestedAt: "11:06 / 03.11.2015", period: "03.03.17 - 06.03.17", requestedFor: "Mihai ANDRONACHE", createdBy: "Hajnalka MATEKOVITS", requestedFrom: "Alex POPESCU", status: "Rejected"},
    {id:3, type: "Parking Spot Rental", requestedAt: "11:06/03.11.15", period: "15.08.16", requestedFor: "Maria DIN", createdBy: "Maria DIN", requestedFrom: "Alex POPESCU", status: "Completed"},
    {id:4, type: "Parking Spot Reservation", requestedAt: "11:06/03.11.15", period: "01.12.16", requestedFor: "Mihai ANDRONACHE", createdBy: "Mihai ANDRONACHE", status: "Approved"}
];

const log = getLogger('RequestList');

export default class RequestListScreen extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            requestsData: [],
            loaded: 0,
        }
    }

    componentDidMount() {
        if (this.props.navigation.state.params.r !== undefined) {
            let receivedData = JSON.parse(this.props.navigation.state.params.r);
            this.setState({
                requestsData: receivedData,
                dataSource: this.state.dataSource.cloneWithRows(receivedData),
                loaded: 1,
            });
            log('Received requests data');
        }else{
            // if component state was lost( after an unmount) - navigation causes the component to mount again
            // offline - working with local storage
            this.fetchDataLocalStorage()
        }

        // offline - working with local storage
        // this.fetchDataLocalStorage();
        //
        // TODO: async adapter( synchronization with the backend) OFFLINE SUPPORT
        //
        // online - retrieve data from remote persistence
        // currently data is fetched from db.json
        // this.fetchDataRemote();
    }


    // do not set state here => infinite loop( setState & forceUpdate -> re-rendering)
    componentDidUpdate(prevProps, prevState ) {

        //create request
        if (this.props.navigation.state.params.newRequest !== undefined) {
            log(`Received new request:\n ${prevProps.navigation.state.params.newRequest}`);

            // newRequest is a JSON object
            let newRequest = JSON.parse(this.props.navigation.state.params.newRequest);
            newRequest["id"] = this.state.requestsData[this.state.requestsData.length-1] + 1;

            log(`New request:\n ${JSON.stringify(newRequest)}`);
            this.state.requestsData.push(newRequest);
            log(`New requests data length:\n ${this.state.requestsData.length}`);
            this.props.navigation.state.params.newRequest = undefined;

            // save modifications to local storage
            this.saveDataOnLocalStorage();
        }

        // update request
        if (this.props.navigation.state.params.editedData !== undefined) {
            log(`Received editedData:\n ${this.props.navigation.state.params.editedData}`);
            let editedRequest = JSON.parse(this.props.navigation.state.params.editedData);
            //replace old element
            // let newRequestsData = this.state.requestsData.find(request => request.id == this.props.navigation.state.params.editedData.id);
            // this.state.requestsData.splice(this.state.requestsData.indexOf(newRequestsData), 1, newRequestsData);
            //OR:
            //delete old element
            this.state.requestsData = this.state.requestsData.filter(
                request => request.id != editedRequest.id
            );
            // add new element
            log(`Edited request:\n ${JSON.stringify(editedRequest)}`);
            this.state.requestsData.push(editedRequest);
            this.props.navigation.state.params.editedData = undefined;
            this.props.navigation.state.params.r = this.state.requestsData;

            // save modifications to local storage
            this.saveDataOnLocalStorage();
        }

        //edit request
        if (this.props.navigation.state.params.deletedId !== undefined) {
            log(`Received deletedId:\n ${this.props.navigation.state.params.deletedId}`);
            let newRequestsData = this.state.requestsData.find(
                request => {return request.id == this.props.navigation.state.params.deletedId}
            );
            log(`Request to delete:\n ${JSON.stringify(newRequestsData)}`);
            let index = this.state.requestsData.indexOf(newRequestsData);
            log("Delete from index: " + index);
            log(`Data length before delete:\n ${this.state.requestsData.length}`);
            // let oldRequestsData = this.state.requestsData;
            this.state.requestsData.splice(index, 1);
            log(`Data length after delete:\n ${this.state.requestsData.length}`);
            this.props.navigation.state.params.deletedId = undefined;  // avoid another deletion

            // save modifications to local storage
            this.saveDataOnLocalStorage();
            log("Data saved to local storage after delete action");
        }

        // determine if state is dirty & if so, update view
        if (this.state.requestsData !== prevState.requestsData)
            this.updateDataSource(this.state.requestsData);

    }

    // when a new request is created, the data source and the request list are updated
    // when the app closes, the changes are saved to the local storage
    // componentWillReceiveProps(nextProps){
    //     log("next"+nextProps);
    //     log("next"+this.props.navigation);
    //
    //     if (this.props.navigation.state.params.newRequest !== nextProps.navigation.state.params.newRequest) {
    //         log(`Received new request:\n ${this.props.navigation.state.params.newRequest}`);
    //
    //         // newRequest is a JSON object
    //         let newRequest = JSON.parse(this.props.navigation.state.params.newRequest);
    //         newRequest["id"] = this.state.requestsData.length + 1;
    //
    //         log(`RequestList - New request:\n ${newRequest}`);
    //         this.state.requestsData.push(newRequest);
    //         log(`New requests data:\n ${this.state.requestsData.length}`);
    //         this.updateDataSource(this.state.requestsData);
    //     }
    //
    //     if (this.props.navigation.state.params.editedData !== this.props.navigation.state.params.editedData){
    //         log(`Received editedData:\n ${this.props.navigation.state.params.editedData}`);
    //     }
    //
    //     if (this.props.navigation.state.params.deletedId !== this.props.navigation.state.params.deletedId){
    //         log(`Received deletedId:\n ${this.props.navigation.state.params.deletedId}`);
    //         this.state.requestsData.filter(item => item.id !== this.props.navigation.state.params.deletedId);
    //         this.updateDataSource(this.state.requestsData);
    //     }
    // }

    updateDataSource(newDS){
        log("Updating view");
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newDS),
            loaded: 1,
        });
    }

    saveDataOnLocalStorage(){
        return AsyncStorage.setItem('allRequestsData', JSON.stringify(this.state.requestsData))
            .then(json => log('Requests data saved to local storage.'))
            .catch(error => log('Saving requests data to local storage encountered a problem.'));
    }

    fetchDataRemote() {
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listData),
        //     loaded: 1,
        // });

        RequestsAPI.getRequests()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        requestsData: responseData,
                        dataSource: this.state.dataSource.cloneWithRows(responseData),
                        loaded: 1,
                    });
                    log('Requests data retrieved from remote storage.');
                } else {
                    this.showRetry();
                }
            })
            .catch((err) => {
                console.error(err);
                this.showRetry();
            })
            .done();
    }

    fetchDataLocalStorage() {
        return  AsyncStorage.getItem('allRequestsData')
            .then(req => JSON.parse(req))
            .then(requestsLocal => {
                this.setState({
                    requestsData:requestsLocal,
                    dataSource: this.state.dataSource.cloneWithRows(requestsLocal),
                    loaded: 1,
                });
                log('Requests data retrieved from local storage.');
            })
            .catch(err => {
                console.error(err);
                log('Requests data could not be retrieved from local storage.');
            })
    }

    // componentWillUnmount() {
    //     // save requests data to local storage before unmounting component
    //     this.saveDataOnLocalStorage();
    // }
    //
    // saveDataOnLocalStorage(){
    //     return AsyncStorage.setItem('allRequestsData', JSON.stringify(this.state.allRequestsData))
    //         .then(json => log('Requests data saved to local storage.'))
    //         .catch(error => log('Saving requests data to local storage encountered a problem.'));
    // }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    renderRequest(nav, request) {
        // log("RENDER:");
        // log(JSON.stringify(request));
        if (request!== undefined && request.id !== undefined) {
            return (
                //TODO: different fields shown depending on the request type
                <TouchableNativeFeedback
                    accessible={true}
                    accessibilityLabel={'Tap on the row to view & edit the request.'}
                    onPress={() => nav.navigate('Details', {requestData: `${JSON.stringify(request)}`})}>
                    <View style={styles.listItemWrapper} accessibilityLiveRegion="assertive">
                        <Text accessible={true}
                              accessibilityLabel="This is a request item">
                            {request.type}
                            {"\n"}Requested by: {request.requestedFor}
                            {"\n"}Requested from: {request.requestedFrom}
                            {"\n"}Status: {request.status}
                            {"\n"}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            );
        }else{
            return null;
        }
    }

    render() {
        let nav = this.props.navigation;

        if (this.state.loaded === 0) {
            return (
                <View style={styles.screen}>
                    <Text> Welcome to the Parking System App :) </Text>
                    <Text> Please wait... </Text>
                    <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                </View>);
        } else if (this.state.loaded === 2) {
            return (
                <View style={styles.screen}>
                    <Text> The content is not available </Text>
                    <Button title="RETRY"
                            backgroundColor='#3f51b5'
                            onPress={() => {
                                this.setState({loaded: 0});
                                this.fetchDataRemote();}}/>
                </View>);
        }
        return (
            <View style={styles.screen}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRequest.bind(this, nav)}
                    style={styles.listView}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f2f2f2',
    },
    listView: {
        paddingTop: 20,
       backgroundColor: '#f2f2f2',
    },
    listItemWrapper: {
        margin: 5,
        backgroundColor: '#B6C5D3',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activityIndicator: {
        height: 50,
    },
});
