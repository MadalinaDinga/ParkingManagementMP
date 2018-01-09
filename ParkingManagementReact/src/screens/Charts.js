import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import RequestsPopularityPieChart from "../components/charts/RequestsPopularityPieChart";

export default class ChartsScreen extends Component {
    render() {
        return (
            <View>
                <Text style={styles.title}>Requests popularity</Text>
                <RequestsPopularityPieChart requestsData = {this.props.navigation.state.params.r}/>
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
