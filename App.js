import { StatusBar } from 'expo-status-bar';
import React, { Component, Fragment, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Scan from './components/scanScreen.js';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressCircle from 'react-native-progress-circle';
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
  LEVEL_WORD,
} from 'react-native-tesseract-ocr';

const stackNav = createStackNavigator();

// Venmo calculator

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {name: 'Kevin', items: [[]], restaurantName: null};
	}
	
	setItems(inArray){
		this.setState({items: inArray});
	}
	setRName(rname){
		this.setState({restaurantName: rname});
	}
	
	render() {
		return(
			<NavigationContainer>
				<stackNav.Navigator initialRouteName='home'>
					<stackNav.Screen name='home'>
					 {props => <HomeScreen {...props} name={this.state.name} name2={'NaMe2'}/>}
					</stackNav.Screen>
					<stackNav.Screen name='scan'>
					 {props => <ScanScreen {...props} itemSetter ={(ilist) => {this.setItems(ilist);}} resSetter ={(rname) => {this.setRName(rname);}} />}
					</stackNav.Screen>
					<stackNav.Screen name='manual' component={manualScreen}/>
					<stackNav.Screen name='review' component={reviewScreen}/>
					<stackNav.Screen name='after'>
					{props => <AfterScan {...props} itemsArray={this.state.items} resName={this.state.restaurantName}/>}
					</stackNav.Screen>
				</stackNav.Navigator>
			</NavigationContainer>
		);
	}
}



export class HomeScreen extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<View style={styles.home}>
				<Text>{this.props.name}</Text>
				<Text style={styles.ScreenHeading}>Venmo Calculator</Text>
				<TouchableOpacity
					style={styles.TOContainer}
					onPress={ () => this.props.navigation.navigate('scan')}
				>
					<Text style={styles.TOText}>Scan Receipt</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={styles.TOContainer}
					onPress={ () => this.props.navigation.navigate('manual')}
				>
					<Text style={styles.TOText}>Enter a Receipt</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					style={styles.TOContainer}
					onPress={ () => this.props.navigation.navigate('review')}
				>
					<Text style={styles.TOText}>View Past Receipts</Text>
				</TouchableOpacity>

			</View>
		);
	}
}


export class AfterScan extends Component{
	constructor(props){
		super(props);
		console.log('after screen');
		console.log(this.props.itemsArray);
		console.log(this.props.resName);
	}
	
	
	render(){
		return(
				<View style={styles.home}>
					<Text>Restaurant name: {this.props.resName}</Text>
					{ this.props.itemsArray.map((item, key) => (
						<Text key= {key}>{item[0]}</Text>)
					
					)}
					
				</View>
		
		
		)
	}
}

export class ScanScreen extends Component{
	constructor(props){
		super(props);
		this.state = {items: [[]], loaded: false, name:'kevin scan', restaurantName: null};
	}
	
	setLoaded(l){
		this.setState({loaded: l})
	}
	
	setItems(inArray){
		this.setState({items: inArray});
	}
	
	setRName(rname){
		this.setState({restaurantName: rname});
	}
		
	render(){

		return(
			<View style={{ flex: 1}}>
				<Scan loadSetter ={(l) => {this.setLoaded(l);}}
					  itemSetter ={(ilist) => {this.setItems(ilist);}}
					  resSetter ={(rname) => {this.setRName(rname);}} />
				
				{this.state.loaded ?
					(<TouchableOpacity
						style={styles.LoadedContainer}
						onPress={this.onpress}
					>
						<Text style={styles.TOText}>Continue</Text>
					</TouchableOpacity>):
					
					(<TouchableOpacity
						style={styles.TOContainer}
						onPress={this.notActive}
					>
						<Text style={styles.TOText}>Continue</Text>
					</TouchableOpacity>)
					
				}
				
				
				
			</View>
    );
  }
  
	onpress = () => {
		this.props.navigation.navigate('after', {name : this.state.name});
		console.log(this.state.items);
		this.props.itemSetter(this.state.items);
		this.props.resSetter(this.state.restaurantName);
  }
  
	notActive = () => {
		Alert.alert('Please Select an Image');
	}
  
}

export class manualScreen extends Component{
	render(){
		return(
			<View style={styles.container}>
				<Text style={styles.ScreenHeading}>Enter A Receipt</Text>
				<TouchableOpacity
					style={styles.TOContainer}
					onPress={ () => this.props.navigation.navigate('scan')}
				>
					<Text style={styles.TOText}>Scan Receipt</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export class reviewScreen extends Component{
	render(){
		return(
			<View style={styles.container}>
				<Text>review screen</Text>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	view: {
		flex:1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	capture: {
		flex: 0,
		backgroundColor: 'blue',
		borderRadius: 10,
		color: 'red',
		padding: 15,
		margin: 15,
	},
	homeScreen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	home: {
		flex: 1,
		backgroundColor: 'lightblue',
		color: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	homeButtons: {
		backgroundColor: 'lightgray',
		margin: 30,
		borderRadius: 10,
		color: 'white',
	},	
	TOContainer: {
		backgroundColor: 'lightgray',
		margin: 30,
		borderRadius: 10,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	LoadedContainer: {
		backgroundColor: 'lightblue',
		margin: 30,
		borderRadius: 10,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	TOText: {
		color: 'white',
		fontSize: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ScreenHeading: {
		color: 'black',
		fontSize: 30,
		position: 'absolute',
		top: 40,
	},

});
