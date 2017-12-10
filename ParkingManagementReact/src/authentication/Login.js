import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    CheckBox,
    Alert,
} from 'react-native';
import {AsyncStorage} from 'react-native';
import {Button} from "react-native-elements";
import {raisedButtonAttributes} from "../common/attributes";
import UsersAPI from "../api/LoginAPI";
import RequestsAPI from "../api/RequestsApi";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            auth: false,

            // the list of registered users
            usersData: [],

            // all requests data
            allRequestsData: [],
            loaded: 0,

            // the checkbox is unchecked by default
            rememberUserChecked: false,
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('username',(err, result) => {
            this.setState({
                username: result,
            })
        });

        AsyncStorage.getItem('password',(err, result) => {
            this.setState({
                password: result,
            })
        });

        this.fetchUsersDataRemote();

    };

    fetchUsersDataRemote() {
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listData),
        //     loaded: 1,
        // });

        UsersAPI.getUsers()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        usersData: responseData,
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

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    fetchAllRequestsDataRemote() {
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listData),
        //     loaded: 1,
        // });

        RequestsAPI.getRequests()
            .then((responseData) => {
                if (responseData !== null) {
                    this.setState({
                        allRequestsData: responseData,
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

    fetchAllRequestsDataLocalStorage() {
        return  AsyncStorage.getItem('allRequestsData')
            .then(req => JSON.parse(req))
            .then(requestsLocal => {
                this.setState({
                    allRequestsData:requestsLocal,
                });
                console.log('Login - Requests data retrieved from local storage.');
            })
            .catch(err => {
                console.error(err);
                console.log('Login - Requests data could not be retrieved from local storage.');
            })
            .done()
    }

    handleCheckBox = () => {
        // console.log("Remember me - " + !this.state.rememberUserChecked);
        if (this.state.rememberUserChecked === false ) {
            this.setState({
                rememberUserChecked: true
            });
        }else{
            this.setState({
                rememberUserChecked: false
            });
        }
    };

    decideLoginInfoSavedToLocalStorage(username, password){
        console.log("Remember me - " + this.state.rememberUserChecked);
        // save username/ password into the async storage
        if (this.state.rememberUserChecked === true ) {
            AsyncStorage.setItem('username', username);
            AsyncStorage.setItem('password', password);
            console.log('Username: ', username,' and password: ', password,' saved to local storage');
        }else{
            AsyncStorage.removeItem('username');
            AsyncStorage.removeItem('password');
            console.log('Username: ', username,' and password: ', password,' not saved to local storage');
        }
    }

    decideViewAccessByUserType(type, nav) {
        if (type === 'admin'){
            // an admin can view all requests from all registered users
            this.fetchAllRequestsDataLocalStorage();
            if ( this.state.allRequestsData === null ) {
                this.fetchAllRequestsDataRemote();
            }
            //TODO: add loading gif( fix loading)

            nav.navigate('AdminScreenNavigator', {r: `${JSON.stringify(this.state.allRequestsData)}`})
        }else{
            //TODO: fetch user's requests
            // a user can only view his requests
            // this.fetchUserRequestsDataLocalStorage();

            //TODO: pass requests data to the screen navigator
            nav.navigate('NormalUserScreenNavigator');
        }
        console.log("Logged in as ", type);
    }

    handleWrongUsernamePassword(auth){
        // TODO: account recovery
        if (!auth){
            Alert.alert(
                'Auth Fail',
                'Wrong username or password.',
                [
                    {text: 'Retry', onPress: () => console.log('Retry Pressed')},
                ],
                { cancelable: false }
            );
        }
    }

    handleLogin = (username, password, nav) =>{
        console.log("Login - username: " + username + " password: " + password + " nav: " + nav);

        //the username & password can not be white spaces or null
        if (username.trim().length === 0 || password.trim().length === 0) {
            Alert.alert(
                'Empty fields',
                'Username & password can not be empty.',
                [
                    {text: 'Retry', onPress: () => console.log('Retry Pressed')},
                ],
                { cancelable: false }
            );
        }else{
            for (let user of this.state.usersData){
                // the given username & password are registered
                if (user.username === this.state.username && user.password === this.state.password){

                    this.state.auth = true;

                    // decide whether to save the username & password to local storage
                    this.decideLoginInfoSavedToLocalStorage(user.username, user.password);

                    // different views depending on user type( admin/ default)
                    this.decideViewAccessByUserType(user.type, nav);
                }
            }
            // the given username & password not found
            this.handleWrongUsernamePassword(this.state.auth);
        }
    };

    render() {
        let nav = this.props.navigation;

        //if there already exists a username/ password in the async storage, then use them as default value
        let defaultValueUsernameTextBox = {};
        if (this.state.username !== ''){
            defaultValueUsernameTextBox.defaultValue = this.state.username;
        }

        let defaultValuePasswordTextBox = {};
        if (this.state.password !== ''){
            defaultValuePasswordTextBox.defaultValue = this.state.password;
        }

        return (
            <View style={styles.content}>
                <Text>Username</Text>
                <TextInput
                    {...defaultValueUsernameTextBox}
                    style={styles.textBox}
                    placeholder="type your username here"
                    autoCapitalize= "none"
                    autoCorrect={false}
                    accessibilityLabel="Write your username"
                    onChangeText={(text) => this.setState({...this.state, username: text})}
                    />

                <Text>Password</Text>
                <TextInput
                    {... defaultValuePasswordTextBox}
                    style={styles.textBox}
                    placeholder="type your password here"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    accessibilityLabel="Write your password"
                    onChangeText={(text) => this.setState({...this.state, password: text})}
                    />

                <Text>Remember Me</Text>
                <CheckBox
                    style={{margin:10}}
                    value={this.state.rememberUserChecked}
                    accessibilityLabel="Select to save your username and password"
                    onValueChange={this.handleCheckBox.bind(this)}
                />

                <Button
                    {... raisedButtonAttributes}
                    title="LOGIN"
                    accessibilityLabel="Login"
                    onPress={this.handleLogin.bind(this,
                        this.state.username, this.state.password, nav)}
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    content: {
        marginTop: 70,
        flex: 1,
        alignItems: "center",
        flexDirection: 'column'
    },

    textBox: {
        margin: 15,
        padding:15,
        alignSelf: "center",
        textAlign: "center",
        width: 250
    },
});