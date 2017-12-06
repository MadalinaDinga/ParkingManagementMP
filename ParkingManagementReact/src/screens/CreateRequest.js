import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Button, TextInput, Picker,
    Share,
    Alert,
} from 'react-native';
import RequestsAPI from "../api/RequestsApi";

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

export default class CreateRequest extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            //input fields state
            requestType: "",
            receiverName: "",
            creatorName: "",
            messageFromCreator: "",

            //the request types
            requestTypesData: [],

            inputData: [],

            loaded: 0,

        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData(){
        // this.setState({
        //     requestTypesData: requestTypes,
        //     loaded: 1,
        // });

        RequestsAPI.getRequestTypes()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        requestTypesData: responseData,
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    handleCreateRequest = (requestType, receiverName, creatorName, creatorMessage) => {
        console.log("selectedRequestType: " + requestType + "receiverName: " + receiverName + "creatorName: " + creatorName + "messageFromCreator: " + creatorMessage);
        if (receiverName!=="" && creatorName!=="" && creatorMessage!=="") {
        // if (requestType!=="" && receiverName!=="" && creatorName!=="" && creatorMessage!=="") {
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
        }else{
            Alert.alert(
                'Empty fields',
                'Please fill all the input fields.',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            );
        }
    };

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
                    <Button title="Retry" onPress={() => {
                        this.setState({loaded: 0});
                        this.fetchData();
                    }}/>
                </View>);
        }
        return (
            <View style={styles.screen} accessibilityLiveRegion="assertive">
                <Text style={styles.title}>New Request</Text>

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

                <Button
                    style={{fontSize: 20}}
                    onPress={this.handleCreateRequest.bind(this,
                        this.state.selectedRequestType, this.state.receiverName, this.state.creatorName, this.state.messageFromCreator)}
                    title="Create Request"
                    color="#841584"
                    accessible={true}
                    accessibilityLabel="Send the request"
                    accessibilityComponentType="button"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen:{

    },
    title: {
        fontWeight:'bold',
        fontSize:20,
    },
    textInput: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 2,
        margin: 10,
    },

});
