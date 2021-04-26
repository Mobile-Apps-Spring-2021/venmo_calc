import React, {useState, useRef, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
//import { openDatabase } from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';





export default function History() {
	
	const db = SQLite.openDatabase({name: 'history.db', createFromLocation: '~www/history.db'});
	const [pastReqs, setPastReqs] = useState([]);
		
	const refresh = async() => {
		db.transaction( tx => {
			tx.executeSql('select * from requests', [], (tx, results) => {
				var temp = [];
				for (let i = 0; i < results.rows.length; ++i)
					temp.push(results.rows.item(i));
				console.log(temp);
				setPastReqs(temp);
			 });
				}, error => {
				   console.log(error);
			 });
	};

	useEffect(() => {
		console.log('history');
		 
		refresh();
		
	}, []);
	
    return(
        <View style = {styles.container}>
			<View style = {styles.heading}>
				<Text style = {styles.textHeading}>Past Requests</Text>
			</View>
			<View style = {styles.flist}>
				<FlatList
					veritical
					style={styles.addContactFlatList}
					contentContainerStyle={styles.contactFlatListContainer} data={pastReqs}
					keyExtractor={(item, index) => item + index}
					renderItem={ ({item, index}) => {
						console.log(item);
						let i = 0;
						return (<Text style = {styles.flistText}>{item.username}   |  {item.price}   |   {item.title}</Text>)
					}}>
				</FlatList>
			</View>
			<View style = {styles.refreshButton}>
				<TouchableOpacity
					onPress={() => {
						refresh();
					}}>
					<Text>
						Refresh
					</Text>
                </TouchableOpacity>
			</View>
			
			
        </View>
    )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
	  flex: 1,
	  position: 'absolute',
	  top: 0,
	  alignItems: 'center',
	  justifyContent: 'center',
  },
  refreshButton : {
	  flex: 1,
	  position: 'absolute',
	  bottom: 10,
	  alignItems: 'center',
	  justifyContent: 'center',
  },
  textHeading: {
	  fontSize: 30,
	  
  },
  addContactFlatListItem: {
	flex:1,
	backgroundColor: 'white',
    height: 500,
    width: 500,
    borderRadius: 30,
	padding:2,
	margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactFlatList: {
	flex: 1,
    //flexDirection: 'column',
  },
  contactFlatListContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: '3%',
  },
  flist : {
	flex:1,
	position: 'absolute',
	top: 100,
	left: 20,
  },
    flistText : {
	fontSize: 20,	
  }
});