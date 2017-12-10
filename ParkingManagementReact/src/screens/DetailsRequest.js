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
            id: "",
            requestType: "",
            requestPeriod: "",
            comment: "",

            loaded: 0,
        }
    }

    componentDidMount() {
        // request types
        this.fetchDataLocalStorage();
        // this.fetchDataRemote();

        // the request data is sent through navigation props
        let requestData = JSON.parse(this.props.navigation.state.params.requestData);
        console.log(`DetailsRequest - request data ${requestData}`);
        this.setState({
            requestData: requestData,
            id: requestData.id,
            selectedRequestType: requestData.type,
            requestPeriod: requestData.period,
            comment:requestData.comment,
            loaded: 1,
        });
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    // fetch from remote storage
    fetchDataRemote(){
        this.fetchRequestTypesRemote();
    }

    fetchRequestTypesRemote(){
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

    fetchRequestByIdRemote() {
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
    }

    //fetch from local storage
    fetchDataLocalStorage() {
        this.fetchRequestTypesLocalStorage();
    }

    fetchRequestTypesLocalStorage(){
        return AsyncStorage.getItem('requestTypesData')
            .then(req => JSON.parse(req))
            .then(requestsTypes => {
                this.setState({
                    requestTypes: requestsTypes,
                    loaded: 1,
                });
                console.log('CreateRequest - Request Types data retrieved from local storage.');
            })
            .catch(err => {
                console.error(err);
                console.log('CreateRequest - Request Types data could not be retrieved from local storage.');
            })
            .done()
    }

    handleEdit = (id, requestPeriod, requestType, comment) =>{
        console.log('Clicked!');
        console.log("Edited data - " + "id: " + id +  " period: " + requestPeriod + " type: " + requestType + " comment: " + comment);
        if( comment === undefined){
            comment = "";
        }
        // perform data edit
        let editedData = {
            id: id,
            type: requestType,
            period: requestPeriod,
            comment: comment,
        };
        this.props.navigation.navigate('Requests', {editedData: `${JSON.stringify(editedData)}`})
    };

    handleDelete = (id) =>{
        console.log('Clicked!');
        console.log('Request with id ',id, ' marked for deletion');

        // perform delete
        this.props.navigation.navigate('Requests', {deletedId: `${JSON.stringify(id)}`})
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
                    onPress={this.handleEdit.bind(this, this.state.id, this.state.requestPeriod, this.state.selectedRequestType, this.state.comment)}/>

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
                                this.fetchDataRemote();}}
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
