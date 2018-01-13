import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
} from 'react-native';
import {VictoryContainer, VictoryPie} from 'victory-native';
import {getLogger} from "../../common/utils";

//http://formidable.com/open-source/victory/docs/victory-pie/

const log = getLogger('RequestsPopularityPieChart');

export default class RequestsPopularityPieChart extends Component {
    constructor(){
        super();
        this.state = {
            requestsData: [],
            requestsTypes: [],  // TODO: also receive types through props
        };
    }

    componentDidMount(){
        if (this.props.requestsData !== undefined)
            this.setState({
                requestsData: JSON.parse(this.props.requestsData)
            });
        else
            this.fetchDataLocalStorage();
    }

    fetchDataLocalStorage() {
        return  AsyncStorage.getItem('allRequestsData')
            .then(req => JSON.parse(req))
            .then(requestsLocal => {
                this.setState({
                    requestsData:requestsLocal,
                });
                log('RequestList - Requests data retrieved from local storage.');
            })
            .catch(err => {
                console.error(err);
                log('RequestList - Requests data could not be retrieved from local storage.');
            })
    }

    countRequests(requestsData){
        let x = [0,0,0,0,0,0,0];
        for (req in requestsData){
            // log(req);
            switch(requestsData[req].type) {
                case "Parking Spot Rental":
                    x[0]++;
                    break;
                case "Parking Spot Reservation":
                    x[1]++;
                    break;
                case "Parking Subscription":
                    x[2]++;
                    break;
                case "Cancel Subscription":
                    x[3]++;
                    break;
                case "Cancel Reservation":
                    x[4]++;
                    break;
                case "Quit Rental":
                    x[5]++;
                    break;
                case "Drop Out Registration":
                    x[6]++;
                    break;
            }
        }
        return x;
    }

    render() {
            const dataSet = this.countRequests(this.state.requestsData);

            return (
                <View>

                    <VictoryPie colorScale={["tomato", "orange", "gold", "cyan", "navy", "blue", "green"]}
                                data={[
                                    {x: "Parking Spot Rental", y: dataSet[0]},
                                    {x: "Parking Spot Reservation", y: dataSet[1]},
                                    {x: "Parking Subscription", y: dataSet[2]},
                                    {x: "Cancel Subscription", y: dataSet[3]},
                                    {x: "Cancel Reservation", y: dataSet[4]},
                                    {x: "Quit Rental", y: dataSet[5]},
                                    {x: "Drop Out Registration", y: dataSet[6]}
                                ]}
                                containerComponent={<VictoryContainer responsive={true}/>}
                    />

                </View>
            );
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chart: {
        flex: 1
    }
});



