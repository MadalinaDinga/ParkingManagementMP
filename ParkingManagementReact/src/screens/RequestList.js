import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicator,
    Button, TouchableHighlight,
} from 'react-native';
import RequestsAPI from "../api/RequestsApi";

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
            loaded: 0,
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    fetchData() {
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listData),
        //     loaded: 1,
        // });

        RequestsAPI.getRequests()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseData),
                        loaded: 1,
                    });
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


    renderRequest(nav, request) {
        return (
            /*TODO: different fields depending on the request type*/
        <TouchableHighlight
            accessible={true}
            accessibilityLabel={'Tap on the row to view & edit the request.'}
            onPress={() => nav.navigate('Details', {id: `${request.id}`})}>
            <View style={styles.listItemWrapper} accessibilityLiveRegion="assertive">
                <Text style={styles.listItem}
                      accessible={true}
                      accessibilityLabel="This is a request item">{request.id} - {request.type}
                    {"\n"}Requested by: {request.requestedFor}
                    {"\n"}Requested from: {request.requestedFrom}
                    {"\n"}Status: {request.status}
                    {"\n"}
                </Text>
            </View>
        </TouchableHighlight>
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
                    <Button title="Retry" onPress={() => {
                        this.setState({loaded: 0});
                        this.fetchData();
                    }}/>
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
    },
    activityIndicator: {
        height: 50,
    },
});
