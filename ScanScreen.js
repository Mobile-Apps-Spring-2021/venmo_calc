/////////////// OCR as CLASS COMPONENT \\\\\\\\\\\\\\\\\\\\\\


import React, {useState} from 'react';
import {Button, StyleSheet, Text, View, Image, TouchableOpacity, Alert} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NewReceipt from './NewReceipt'
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
  LEVEL_WORD,
} from 'react-native-tesseract-ocr';

const DEFAULT_HEIGHT = 1000;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,

};
const stackNav = createStackNavigator();


export default class ScanScreen extends React.Component {
	
	render(){
		return(
			<NavigationContainer independent={true}>
			  <stackNav.Navigator initialRouteName='scan'>
				<stackNav.Screen name='scan' component={Scan}/>
				<stackNav.Screen name='review' component={NewReceipt}/>
			   </stackNav.Navigator>
			</NavigationContainer>
		);
	}
}

export class Scan extends React.Component {
	constructor(props){
		super(props);
		this.state = { isLoading: false, progress: 0, imgSrc: null, text: '', arrayOfItems: [], restaurantName: null, isLoaded: false};	
	}
	
	processText(inText){
		console.log('//////// processing text \\\\\\\\');
		const regex = /\d+\.\d*$/
		//const regex = /\d+.?\d*$/;
		let tempText = inText;
		var linesArray = inText.split('\n');
		var len = linesArray.length;
		var item = '';
		var price = '';
		var outIndex = 0;
		var outArray = [];
		
		for(x=0; x<len; x++){
			numStartIndex = linesArray[x].search(regex);
			if(numStartIndex > 0){
				item = linesArray[x].substring(0, numStartIndex);
				price = linesArray[x].substring(numStartIndex);
				item = item.trim();
				price = price.trim();
				outArray.push({name: item, price: price});
				console.log(outArray[0].name);
				//outArray[outIndex][1] = parseFloat(outArray[outIndex][1]);
				outIndex++;
			}

		}

		console.log(outArray);
		console.log(linesArray[0]);
		this.setState({arrayOfItems: outArray});
		this.setState({restaurantName: linesArray[0]});
		this.setState({isLoaded: true});
		//this.props.itemSetter(outArray);
		//this.props.resSetter(linesArray[0]);
		//this.props.loadSetter(true);
		
	}
	
	async recognizeTextFromImage(path){
		this.setState({isLoading: true});
		
		try {
			const tesseractOptions = {};
			const recognizedText = await TesseractOcr.recognize(
				path,
				LANG_ENGLISH,
				tesseractOptions,
			);
			console.log(recognizedText);
			this.processText(recognizedText);
			this.setState({text: recognizedText});
		} catch(err) {
			console.error(err);
			this.setState({text: 'error'});
		}
		
		this.setState({isLoading: false, progress: 0})
	}
	
	recognizeFromPicker = async (options = defaultPickerOptions) => {
		try {
			const image = await ImagePicker.openPicker(options);
			this.setState({imgSrc:{uri: image.path}});
			await this.recognizeTextFromImage(image.path);
		} catch (err) {
				if (err.message !== 'User cancelled image selection') {
					console.error(err);
				}
		  }
	}
	
	recognizeFromCamera = async (options = defaultPickerOptions) => {
		try {
			const image = await ImagePicker.openCamera(options);
			this.setState({imgSrc:{uri: image.path}});
			await this.recognizeTextFromImage(image.path);
		} catch (err) {
				if (err.message !== 'User cancelled image selection') {
					console.error(err);
				}
		  }
	}
	
	render(){
		return (
		
				
			<View style={styles.container}>
				<Text style={styles.title}>Scan A Reciept</Text>
				<Text style={styles.instructions}>Select an image source:</Text>
				<View style={styles.options}>
					<View style={styles.button}>
						<Button
							disabled={this.state.isLoading}
							title="Camera"
							onPress={() => {
								this.recognizeFromCamera();
							}}
						/>
					</View>
					<View style={styles.button}>
						<Button
							disabled={this.state.isLoading}
							title="Library"
							onPress={() => {
								this.recognizeFromPicker();
							}}
						/>
					</View>
				 </View>
				
				 {this.state.imgSrc && (
					<View style={styles.imageContainer}>

							{this.state.isLoading ? (
								<Text>Loading</Text>) : (
								<Text>Loaded</Text>
							)}
					</View>
				 )}
				 
				 {this.state.isLoaded ?
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
		this.props.navigation.navigate('review', {itemsArray: this.state.arrayOfItems, name: 'Kevin'});
		console.log(this.state.arrayOfItems);
		//this.props.itemSetter(this.state.items);
		//this.props.resSetter(this.state.restaurantName);
  }
  
	notActive = () => {
		Alert.alert('Please Select an Image');
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginVertical: 15,
    height: DEFAULT_HEIGHT / 2.5,
    width: DEFAULT_WITH / 2.5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  TOText: {
		color: 'white',
		fontSize: 30,
		justifyContent: 'center',
		alignItems: 'center',
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
		backgroundColor: 'purple',
		margin: 30,
		borderRadius: 10,
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
