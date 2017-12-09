import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Picker, TextInput
} from 'react-native';
import RequestsAPI from "../api/RequestsApi";
import {raisedButtonAttributes} from "../common/attributes";
import {Button} from "react-native-elements";

const requestTypes = [
    {"id": 1, "type": "Parking Spot Rental"},
    {"id": 2, "type": "Parking Spot Reservation"},
    {"id": 3, "type": "Parking Subscription"},
    {"id": 4, "type": "Cancel Subscription"},
    {"id": 5, "type": "Cancel Reservation"},
    {"id": 5, "type": "Quit Rental"},
    {"id": 5, "type": "Drop out registration"}
];

const parkingNo = [
    {"id": 1},
    {"id": 2},
    {"id": 3},
    {"id": 4},
    {"id": 5},
    {"id": 6},
    {"id": 7}
];

export default class DetailsRequest extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            requestData: "",

            //picker for request type
            selectedRequestType: "",
            requestTypes: [],

            //input fields state - the request type, receiver name, request period and message are editable
            requestType: "",
            requestPeriod: "",
            comment: "",

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

    fetchData(){
        RequestsAPI.getRequestsById(this.props.navigation.state.params.id)
            .then((request) => {
                if (request !== null) {
                    this.setState({
                        requestData: request,
                        selectedRequestType: request.type,
                        requestPeriod: request.period,
                        comment:request.comment,
                        loaded: 1,
                    });
                } else {
                    this.showRetry();
                }
            })
            .catch((error) => {
                console.log('Message::ERROR:', error);
                this.showRetry();
            })
            .done();

        RequestsAPI.getRequestTypes()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        requestTypes: responseData,
                        loaded: 1,
                    });
                } else {
                    this.showRetry();
                }
            })
            .catch((error) => {
                console.log('Message::ERROR:', error);
                this.showRetry();
            })
            .done();
    }

    handleEditRequest = (requestPeriod, requestType, comment) =>{
        console.log("Edited data - " + " period: " + requestPeriod + " type: " + requestType + " comment: " + comment);
        //TODO: POST - edit data
    };

    render() {
        if (this.state.loaded === 0) {
            return (
                <View>
                    <Text> Please wait... </Text>
                    <ActivityIndicator/>
                </View>);
        } else if (this.state.loaded === 2) {
            return (
                <View>
                    <Text> The content is not available </Text>
                    <Button title="RETRY"
                            onPress={() => {
                                this.setState({loaded: 0});
                                this.fetchData();}}
                    />
                </View>);
        }
        return (
            <View  accessibilityLiveRegion="assertive">
                <Text>Request type( editable):</Text>
                <Picker
                    selectedValue={this.state.selectedRequestType}
                    onValueChange={(itemValue, itemIndex) => this.setState({selectedRequestType: itemValue})}
                    accessible={true}
                    accessibilityLabel="Choose request type">
                    {this.state.requestTypes.map( (row, index) => (
                            <Picker.Item key={index} label={row.type} value={row.type} />
                        )
                    )}
                </Picker>

                {/*TODO: different fields depending on the request type*/}
                {/*TODO: make the editable/ not editable text inputs more suggestive*/}

                <Text>To:</Text>
                <TextInput
                    style={styles.textInput}
                    value={this.state.requestData.requestedFrom}
                />

                <Text>From:</Text>
                <TextInput
                    style={styles.textInput}
                    value={this.state.requestData.createdBy}
                />

                <Text>Period( editable):</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({requestPeriod: text})}
                    value={this.state.requestPeriod}
                    accessibilityLabel="Change request period"
                />

                <Text>Comment( editable):</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({comment: text})}
                    value={this.state.comment}
                    accessibilityLabel="Change your comment"
                />

                <Text>Status:</Text>
                <TextInput
                    style={styles.textInput}
                    value={this.state.requestData.status}
                />

                <Button
                    {... raisedButtonAttributes}
                    onPress={this.handleEditRequest.bind(this, this.state.requestPeriod, this.state.selectedRequestType, this.state.comment)}
                    title="SAVE CHANGES"
                    color="#841584"
                    accessibilityLabel="Edit request"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
