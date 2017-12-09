import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import RequestsPopularityPieChart from "../components/charts/RequestsPopularityPieChart";


export default class ChartsScreen extends Component {
    constructor(prop) {
        super(prop);
    }

    componentDidMount() {
        //this.fetchDataRemote();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showRetry() {
        this.setState({
            loaded: 2,
        });
    }

    fetchData(){

    }

    render() {
        return (
            <View>
                <Text style={styles.title}>Requests popularity</Text>
                <RequestsPopularityPieChart/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title:{
        fontWeight:'bold',
        fontSize:20,
    }
});
