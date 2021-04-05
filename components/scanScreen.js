/////////////// OCR as CLASS COMPONENT \\\\\\\\\\\\\\\\\\\\\\


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, View, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressCircle from 'react-native-progress-circle';
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
  LEVEL_WORD,
} from 'react-native-tesseract-ocr';

const DEFAULT_HEIGHT = 500;
const DEFAULT_WITH = 600;
const defaultPickerOptions = {
  cropping: true,
  height: DEFAULT_HEIGHT,
  width: DEFAULT_WITH,
};

export default class Scan extends React.Component {
	constructor(props){
		super(props);
		this.state = { isLoading: false, progress: 0, imgSrc: null, text: '', arrayOfItems: [[]]};	
	}
	
	processText(inText){
		console.log('//////// processing text \\\\\\\\');
		const regex = /\d+.?\d*$/;
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
				outArray.push([item,price]);
				outIndex++;
			}

		}

		console.log(outArray);
		this.setState({arrayOfItems: outArray});
		this.props.itemSetter(outArray);
		this.props.loadSetter(true);
		
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
						<Image style={styles.image} source={this.state.imgSrc} />
							{this.state.isLoading ? (
								<Text>Loading</Text>) : (
								<Text>{this.state.text}</Text>
							)}
						<Text>{this.state.arrayOfItems[0][0]}</Text>
					</View>
				 )}
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0FFFF',
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
