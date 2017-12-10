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

const listData = [
    {id:1, type: "Parking Spot Rental", requestedAt: "10:22 / 19.09.2016", period: "13.10.16 - 14.10.16", requestedFor: "Raul SABOU", createdBy: "Raul SABOU", requestedFrom: "Mihai ENACHE", status: "Approved"},
    {id:2, type: "Parking Spot Rental", requestedAt: "11:06 / 03.11.2015", period: "03.03.17 - 06.03.17", requestedFor: "Mihai ANDRONACHE", createdBy: "Hajnalka MATEKOVITS", requestedFrom: "Alex POPESCU", status: "Rejected"},
    {id:3, type: "Parking Spot Rental", requestedAt: "11:06/03.11.15", period: "15.08.16", requestedFor: "Maria DIN", createdBy: "Maria DIN", requestedFrom: "Alex POPESCU", status: "Completed"},
    {id:4, type: "Parking Spot Reservation", requestedAt: "11:06/03.11.15", period: "01.12.16", requestedFor: "Mihai ANDRONACHE", createdBy: "Mihai ANDRONACHE", status: "Approved"}
];

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
        let receivedData = JSON.parse(this.props.navigation.state.params.r);
        this.setState({
            requestsData: receivedData,
            dataSource: this.state.dataSource.cloneWithRows(receivedData),
            loaded: 1,
        });
        console.log('Request list - Received requests data');

        // offline - working with local storage
        // this.fetchDataLocalStorage();

        //TODO: async adapter( synchronization with the backend) OFFLINE SUPPORT

        // online - retrieve data from remote persistence
        // currently data is fetched from db.json
        //this.fetchDataRemote();
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
                    console.log('Login - Requests data retrieved from remote storage.');
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
                console.log('RequestList - Requests data retrieved from local storage.');
            })
            .catch(err => {
                console.error(err);
                console.log('RequestList - Requests data could not be retrieved from local storage.');
            })
            .done()
    }

    componentWillUnmount() {
        // save requests data to local storage before unmounting component
        this.saveDataOnLocalStorage();
    }

    saveDataOnLocalStorage(){
        return AsyncStorage.setItem('allRequestsData', JSON.stringify(this.state.allRequestsData))
            .then(json => console.log('Requests data saved to local storage.'))
            .catch(error => console.log('Saving requests data to local storage encountered a problem.'));
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    renderRequest(nav, request) {
        return (
            //TODO: different fields shown depending on the request type
            <TouchableNativeFeedback
                accessible={true}
                accessibilityLabel={'Tap on the row to view & edit the request.'}
                onPress={() => nav.navigate('Details', {id: `${request.id}`})}>
                    <View style={styles.listItemWrapper} accessibilityLiveRegion="assertive">
                        <Text accessible={true}
                              accessibilityLabel="This is a request item">
                            {request.id} - {request.type}
                            {"\n"}Requested by: {request.requestedFor}
                            {"\n"}Requested from: {request.requestedFrom}
                            {"\n"}Status: {request.status}
                            {"\n"}
                        </Text>
                    </View>
            </TouchableNativeFeedback>
        );
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
