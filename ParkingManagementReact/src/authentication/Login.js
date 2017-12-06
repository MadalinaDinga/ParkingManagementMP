import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    CheckBox, Button,
    Alert,
} from 'react-native';
import {AsyncStorage} from 'react-native';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',

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
        })
    };

    handleCheckBox = (rememberUserChecked, username, password) => {
        console.log("Remember password checked - " + rememberUserChecked + " username: " + username + " password: " + password);
        if (this.state.rememberUserChecked === false ) {
            AsyncStorage.setItem('username', username);
            AsyncStorage.setItem('password', password);

            this.setState({
                rememberUserChecked: true
            });
        }else{
            this.setState({
                rememberUserChecked: false
            });
        }
    };

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
            /*TODO: authorize user( check username & password), user type: admin/ default user*/
            nav.navigate('MainScreenNavigator')
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
                    onValueChange={this.handleCheckBox.bind(this, this.state.rememberUserChecked, this.state.username, this.state.password)}
                />

                <Button
                    style={{fontSize: 20, margin:10}}
                    title="Login"
                    color="#841584"
                    accessible={true}
                    accessibilityLabel="Login"
                    accessibilityComponentType="button"
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