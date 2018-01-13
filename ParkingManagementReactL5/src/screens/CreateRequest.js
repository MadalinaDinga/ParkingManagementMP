import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput, Picker,
    Share,
    Alert,
    AsyncStorage,
} from 'react-native';
import RequestsAPI from "../api/RequestsApi";
import {raisedButtonAttributes} from "../common/attributes";
import {Button} from "react-native-elements";
import {getLogger} from "../common/utils";

const log = getLogger('CreateRequest');

export default class CreateRequest extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            //input fields state
            requestType: "",
            receiverName: "",
            creatorName: "",
            creatorMessage: "",

            //the request types
            requestTypesData: [],

            inputData: [],

            // sent confirmation
            requestSent: false,
            errorMessage: '',

            loaded: 0,

        }
    }

    componentDidMount() {
        // offline - working with local storage
        this.fetchDataLocalStorage();

        if (this.fetchDataLocalStorage() === null){
            // online - retrieve data from remote persistence
            // currently data is fetched from db.json
            this.fetchDataRemote();
        }
    }

    fetchDataRemote(){
        RequestsAPI.getRequestTypes()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        requestTypesData: responseData,
                        loaded: 1,
                    });
                    log('Requests Types data retrieved from remote storage.');
                } else {
                    this.showRetry();
                }
            })
            .catch((error) => {
                log('Message::ERROR:', error);
                this.showRetry();
            })
            .done();
    }

    fetchDataLocalStorage() {
        return  AsyncStorage.getItem('requestTypesData')
            .then(req => JSON.parse(req))
            .then(requestsTypes => {
                this.setState({
                    requestTypesData:requestsTypes,
                    loaded: 1,
                });
                log('Requests Types data retrieved from local storage.');
                return requestsTypes;
            })
            .catch(err => {
                console.error(err);
                log('Requests Types data could not be retrieved from local storage.');
                return null;
            })
            .done()
    }

    componentWillUnmount() {
        // save data to local storage before unmounting component
        this.saveDataOnLocalStorage();
    }

    saveDataOnLocalStorage(){
        return AsyncStorage.setItem('requestTypesData', JSON.stringify(this.state.requestTypesData))
            .then(json => log('Request Types data saved to local storage.'))
            .catch(error => log('Saving Request Types data to local storage encountered a problem.'));
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    static handleSendEmailIntent(requestType, creatorName, receiverName, creatorMessage){
        Share.share({
            message: `${requestType} Request\n from ${creatorName}\n to  ${receiverName}\n Message:\n ${creatorMessage}`,
            url: 'https://github.com/MadalinaDinga/ParkingManagementMP',
            title: `New ${requestType}`
        }, {
            // Android only:
            dialogTitle: 'New request',
            // iOS only:1
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        });
    }

    addRequestToLocalStorage(requestType, receiverName, creatorName, creatorMessage){
        let newReq = {
            id: -1,
            type: requestType,
            comment: creatorMessage,
            requestedFrom: receiverName,
            requestedFor: creatorName,
            requestPeriod: new Date().getDate(),
            status: "Pending"
        };

        log(`New request:\n ${newReq}`);

        //this.props.navigation.state.params.r.push(newReq);
        //this.props.navigation.goBack();
        this.props.navigation.navigate('AdminScreenNavigator', {newRequest: `${JSON.stringify(newReq)}`})
    };

    handleCreateRequest = (requestType, receiverName, creatorName, creatorMessage) => {
        // log("selectedRequestType: " + requestType + "receiverName: " + receiverName + "creatorName: " + creatorName + "creatorMessage: " + creatorMessage);
        if (requestType!=="" && receiverName!=="" && creatorName!=="" && creatorMessage!=="") {
            Alert.alert(
                'Send email',
                'Do you also want to send the request by email?',
                [
                    {text: 'YES', onPress: () => {
                        log('YES pressed - sending email');
                        CreateRequest.handleSendEmailIntent(requestType, creatorName, receiverName, creatorMessage);
                    }},
                    {text: 'NO', onPress: log("NO pressed"), style: 'cancel'},
                ],
                { cancelable: false }
            );

            // add request local operation
            this.addRequestToLocalStorage(requestType, receiverName, creatorName, creatorMessage);

            this.setState({
                requestSent: true,
            });
            // after sending request, navigate to requests list page
            this.props.navigation.navigate('Requests');
        }else{
            Alert.alert(
                'Empty fields',
                'Please fill all the input fields.',
                [
                    {text: 'OK', onPress: () => log('OK Pressed')},
                ],
                { cancelable: false }
            );
        }
    };

    handleResetRequestScreen = () =>{
        this.setState({
            requestType: "",
            receiverName: "",
            creatorName: "",
            creatorMessage: "",
        });
    };

    renderSendConfirmation(){
        if (this.state.requestSent){
            return(
                <Text style={styles.createConfirmation}>Request successfully sent!</Text>
            );
        }
        if (this.state.errorMessage.length > 0){
            return(
                <Text style={styles.createError}>{ this.state.errorMessage.length }</Text>
            );
        }
    }

    renderActionButtons(){
        return(
            <View>
                <Button
                    {... raisedButtonAttributes}
                    title="SEND REQUEST"
                    icon={{name: 'send'}}
                    accessibilityLabel="Send the request"
                    onPress={this.handleCreateRequest.bind(this,
                        this.state.requestType, this.state.receiverName, this.state.creatorName, this.state.creatorMessage)}
                />
                <Button
                    {... raisedButtonAttributes}
                    title="RESET"
                    icon={{name: 'autorenew'}}
                    accessibilityLabel="Reset request input"
                    onPress={this.handleResetRequestScreen.bind(this)}
                />
            </View>
        );
    }

    renderCreateRequestForm(){
        //TODO: the picker should show a default message 'Choose request type'
        return(
            <View>
                <Picker
                    selectedValue={this.state.requestType}
                    onValueChange={(itemValue) => this.setState({requestType: itemValue})}
                    prompt="Choose request type"
                    accessible={true}
                    accessibilityLabel="Choose request type">

                    {this.state.requestTypesData.map( (row, index) => (
                            <Picker.Item key={index} label={row.type} value={row.type} />
                        )
                    )}
                </Picker>

                <Text>Receiver name</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({receiverName: text})}
                    value={this.state.receiverName}
                    accessible={true}
                    accessibilityLabel="Write the receiver's name"
                />

                <Text>Creator name</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({creatorName: text})}
                    value={this.state.creatorName}
                    accessible={true}
                    accessibilityLabel="Write your name"
                />

                <Text>Your message</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({creatorMessage: text})}
                    value={this.state.creatorMessage}
                    accessible={true}
                    accessibilityLabel="Give a comment"
                />
            </View>
        );
    }

    render() {
        if (this.state.loaded === 0) {
            return (
                <View style={styles.screen}>
                    <Text> Please wait... </Text>
                    <ActivityIndicator animating={true} style={styles.activityIndicator} size="large"/>
                </View>);
        } else if (this.state.loaded === 2) {
            return (
                <View style={styles.screen}>
                    <Text> The content is not available </Text>
                    <Button title="RETRY"
                            onPress={() => {
                                this.setState({loaded: 0});
                                this.fetchDataRemote();}}
                    />
                </View>);
        }
        return (
            <View style={styles.screen} accessibilityLiveRegion="assertive">
                <Text style={styles.title}>New Request</Text>
                {this.renderSendConfirmation()}

                {this.renderCreateRequestForm()}

                {this.renderActionButtons()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight:'bold',
        fontSize:20,
    },
    createConfirmation: {
        'fontWeight': 'bold',
        'color': 'green',
        'fontSize': 20,
    },
    createError: {
        'fontWeight': 'bold',
        'color': 'red',
        'fontSize': 20,
    },
    textInput: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 2,
        margin: 10,
    },

});
