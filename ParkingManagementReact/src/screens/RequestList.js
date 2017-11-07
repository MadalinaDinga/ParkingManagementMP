import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicator,
    Button
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

        fetch("http://172.20.10.9:3004/requests")
            .then((response) => {
                if (response.status === 200) {
                    try {
                        return response.json();
                    } catch (e) {
                        console.log("Unable to parse response: " + response, e);
                        this.showRetry();
                        return null;
                    }
                }
                console.log("response: " + JSON.stringify(response));
                this.showRetry();
                return null;
            })
            .then((responseData) => {
                if (responseData !== null) {
                    console.log("responseData:"+JSON.stringify(responseData));
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


        // RequestsAPI.getRequests()
        //     .then((request) => {
        //         this.setState({
        //             requestsDataSource: request
        //         })
        //     })
        //     .catch((error) => {
        //         console.log('Message::ERROR:', error);
        //         this.setState({
        //             showError: true
        //         })
        //     });
    }

    renderRequest(request) {
        return (
        <View>
            <Text>{request.id} - {request.type}
                {"\n"}Requested by: {request.requestedFor}
                {"\n"}Requested from: {request.requestedFrom}
                {"\n"}Status: {request.status}
                {"\n"}
            </Text>
        </View>
        );
    }

    render() {
        if (this.state.loaded === 0) {
            return (
                <View>
                    <Text> Welcome to the Parking System App :) </Text>
                    <Text> Please wait... </Text>
                    <ActivityIndicator/>
                </View>);
        } else if (this.state.loaded === 2) {
            return (
                <View>
                    <Text> The content is not available </Text>
                    <Button title="Retry" onPress={() => {
                        this.setState({loaded: 0});
                        this.fetchData();
                    }}/>
                </View>);
        }
        return (
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRequest}
                    style={styles.listView}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
});
