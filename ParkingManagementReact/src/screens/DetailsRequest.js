import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Picker, TextInput,
    Alert,
    AsyncStorage,
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
            // the edited/ shown request
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

        // for the type picker
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

    handleEdit = (requestPeriod, requestType, comment) =>{
        console.log("Edited data - " + " period: " + requestPeriod + " type: " + requestType + " comment: " + comment);
        //TODO: POST - edit data
    };

    handleDelete = (id) =>{
        console.log('Request with id ',id, ' marked for deletion');
        Alert.alert(
            'Empty fields',
            'Username & password can not be empty.',
            [{
                text: 'Yes',
                onPress: () => {
                    console.log('Delete Pressed');
                    //AsyncStorage.removeItem('requests');
                }
            },],
            { cancelable: true }
        );
        //TODO: perform delete
    };

    renderRequestEditableInfo(){
        //TODO: render info depending on request type( different info is shown)
        return(
        <View>
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

        </View>
        );
    }

    renderActionButtons(){
        //TODO: check admin/ default user
        // Only a default user can create requests
        // A default user can accept/ reject the requests that are addressed to him + can view only his own requests
        // An admin can view everyone's requests + accept/ reject the requests sent to him
        return(
            <View>
                <Button
                    {... raisedButtonAttributes}
                    title="SAVE CHANGES"
                    icon={{name: 'save'}}
                    accessibilityLabel="Edit request"
                    onPress={this.handleEdit.bind(this, this.state.requestPeriod, this.state.selectedRequestType, this.state.comment)}/>

                <Button
                    {... raisedButtonAttributes}
                    title="DELETE"
                    icon={{name: 'delete'}}
                    accessibilityLabel="Delete request"
                    onPress={this.handleDelete.bind(this.state.requestData.id)}/>

                {/*<Button
                    {... raisedButtonAttributes}
                    title="BACK"
                    icon={{name: 'navigate-before'}}
                    accessibilityLabel="Return to requests page"
                    onPress={() => this.props.navigation.navigate('Requests')}/>*/}
            </View>
        );
    }

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
                {this.renderRequestEditableInfo()}

                { this.renderActionButtons() }
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
