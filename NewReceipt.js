import React, {useState, useRef, useEffect} from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getContacts = async() => {
    try {
        const value = await AsyncStorage.getItem('contacts')
        const json = JSON.parse(value);
        return(json);
    } catch(e) {
        console.log(`found error something ${e}`)
    }
}

function getInitials(item) {
	console.log('Item : ' + JSON.stringify(item));
	let splitName = item.name.split(' ');
	var initials = "";
	for (var i = 0; i < 2; i++) {
		if (splitName[i] != null) {
			let character = splitName[i][0]
			initials += character;
		} 
	}
	if (initials.length < 2) {
		initials = item.name.slice(0, 2);
	}
	return initials;
}

function getItemsWithTotal(items) {
    var itemsWithTotal = []
    var total = 0
    items.forEach(item => {
        itemsWithTotal.push(item)
        item.contacts = [0, 1]
        total += parseFloat(item.price);
    })
    itemsWithTotal.push({name : 'total', price : total.toString()})
	console.log('Items with total = ' + JSON.stringify(itemsWithTotal));
    return itemsWithTotal;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  


export default function NewReceipt(props, route, navigation) {
    const ref_input2 = useRef();
    const [price, setPrice] = useState('0.00');
    const [itemName, setItemName] = useState('');
	const [items, setItems] = useState([]);
	const [addedContacts, setAddedContacts] = useState([]);
	const [splitContacts, setSplitContacts] = useState([])
    //const [splitContacts, setSplitContacts] = useState([{name : "Curtis Aaron", venmoUsername : "curtis-aaron"}])
    const [popoverVisibility, setPopoverVisibility] = useState(false);
	const [contactPopoverVis, setContactPopoverVis] = useState(false);
    const [selectedContact, setSelectedContact] = useState(-1);
	const [importedItems, setImportedItems] = useState([]);
	const [refreshPage, setRefreshPage] = useState("");

	const  populateImportedItems = async() => {
		console.log('import in function');
		console.log(importedItems);
		setItems(props.route.params.itemsArray);
	}	


    useEffect(() => {
		
		getContacts().then((contactsValue) => {
            if (contactsValue != "" && contactsValue != null) {
                contactsValue.forEach(element => {
                    element.color = getRandomColor();
					console.log(element.color);
                });
                setSplitContacts(contactsValue)
            }
        })
		console.log(items);
		
		try{
			setItems(props.route.params.itemsArray);
			populateImportedItems();
		}
		catch(err)
		{
			console.log('avoid error');
		}
		
        

    }, [])

    return(

        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); console.log('something')}} accessible={false}>
        <SafeAreaView style={styles.container}>
			
			{/* Popper to select contact for the receipt */}
			{contactPopoverVis && <View style={styles.contactPopover}>
			<Text
				style = {styles.popoverTitleLabel}
				>Add Contacts</Text>
			<FlatList
				vertical
				style={styles.contactFlatList}
				contentContainerStyle={styles.contactFlatListContainer} data={splitContacts}
				keyExtractor={(item, index) => item + index}
				renderItem={ ({item, index}) => {
					let i = 0;
					let contactInfo = item.name + ',\n@' + item.venmoUsername;
					console.log('here ' + addedContacts.includes(item));
					let borderRadius = addedContacts.includes(item) ? 2 : 0;
					let bcolor = addedContacts.includes(item) ? item.color : 'lightgrey';
					console.log('radius ' + borderRadius);
					return (<TouchableOpacity 
							style = {[styles.addContactFlatListItem, {backgroundColor : (addedContacts.includes(item) ? item.color : 'lightgrey') , borderWidth : borderRadius}]}
							onPress ={() => {
								console.log(addedContacts.includes(item));
								setRefreshPage(Math.random());
								i = addedContacts.indexOf(item);
								console.log(i);
								if(addedContacts.includes(item)){
									console.log('Found? ' + i);
									addedContacts.splice(i, 1);
								}
								else{
									addedContacts.push(item);
								}
								
								
								{/*(addedContacts.includes(item) ? addedContacts.push(item) : ; */}
								{/*setSelectedContact(selectedContact == index ? -1 : index);*/}
								console.log('added contacts: ' + JSON.stringify(addedContacts));
							}}>
						<Text>
							{contactInfo}
						</Text>
					</TouchableOpacity>)
				}}>
			</FlatList>
			<View
                style = {styles.buttonContainer}>
				<TouchableOpacity 
					style = {styles.button}
					onPress = { () => {
						setContactPopoverVis(false);
					}}>
					<Text
						style = {styles.buttonText}>
							Close
					</Text>
				</TouchableOpacity>
			</View>
			</View>
			
			//end addContact popper
			
			}
            {popoverVisibility && <View style={styles.popover}>
            <Text
                style = {styles.popoverTitleLabel}
                >Add Item</Text>
            <TextInput
                style = {styles.itemNameInput}          
                returnKeyType = {"next"}
                multiline = {false}
                maxLength = {200}
                placeholder = "Item Name" 
                value = {itemName}
                onChangeText = { text => {setItemName(text)}}
                onSubmitEditing={ () => {ref_input2.current.focus() }}
                />
            <TextInput
                style = {styles.itemPriceInput}          
                returnKeyType = {"next"}
                multiline = {false}
                maxLength = {10}
                placeholder = "Price" 
                keyboardType = "number-pad"
                value = {price}
                ref={ref_input2}
                onChangeText = {text => {
                    let newText = '';
                    let allowedChars = '0123456789.';
                    let decIndex = -1;
                    for (var i=0; i < text.length; i++) {
                        if(allowedChars.indexOf(text[i]) > -1 ) {
                            if (text[i] != '.' || decIndex < 0) {
                                if (!((newText == '' || newText == '.') && text[i] == '0')) {
                                    newText = newText + text[i];
                                }
                                if (text[i] == '.') {
                                    decIndex = i;
                                }
                                if ((i - decIndex != 2) && decIndex >= 0) {
                                    let split = newText.split('.');
                                    let nums = split[0] + split[1];
                                    newText = nums.slice(0, nums.length - 2) + '.' + nums.slice(nums.length - 2);
                                    decIndex = newText.indexOf('.');
                                }
                            }
                        }
                    }
                    let decDiff = newText.length - decIndex;
                    if (decIndex >= 0 && decDiff <= 1) {
                        for (var i=0; i < decDiff; i++) {
                            newText = newText + '0'
                        }
                    }
                    if (decIndex == 0) {
                        newText = '0' + newText
                    } 
                    setPrice(newText);
                }}
                />
                <View
                    style = {styles.buttonContainer}>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            var tempItems = items;
                            if (itemName != "" && price != 0) {
                                tempItems.push({
                                    name : itemName,
                                    price : price,
                                });
                                setPrice('0.00');
                                setItemName('');
                                setItems(tempItems);
                                setPopoverVisibility(false);
                            }
                            console.log(items);
                        }}
                        >
                        <Text
                            style = {styles.buttonText}>
                                Add Item
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            setPrice('0.00');
                            setItemName('');
                            setPopoverVisibility(false);
                        }}
                        >
                        <Text
                            style = {styles.buttonText}>
                                Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>}
            <Text
                style = {styles.titleLabel}
                >Receipt Name</Text>
            <TextInput 
                style = {styles.titleInput}
                returnKeyType = {"next"}
                autoFocus = {true}
                placeholder = "Title" 
                onChangeText={text => console.log(`text = ${text}`)}
                onSubmitEditing={Keyboard.dismiss}
                />
            
                <FlatList
                    style={styles.flatList}
                    data={getItemsWithTotal(items)}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item}) => {
						console.log('data : ' + item);
                        return(<View style={styles.listFullView}>
                                    <View style={styles.listItemView}>
                                        <Text style={styles.listItemName}>{item.name}</Text>
                                        <Text style={styles.listItemPrice}>${item.price}</Text>
                                    </View>
								<FlatList
                                        horizontal 
                                        style={{
                                            height: '100%',
                                        }}
                                        data={item.contacts}
										//added toString to remove an error
                                        keyExtractor={(item, index) => item+index.toString()}
                                        renderItem={({item}) => {
											
											console.log(JSON.stringify(item));
                                            let contact = (splitContacts.length - 1 < item) ? '' : splitContacts[item];
											console.log('Contact = ' + contact);
                                            let initials = (splitContacts.length - 1 < item) ? '' : getInitials(contact);
											console.log('Initials :' + initials);
                                            return(
                                                <View 
                                                    style={{
                                                        height: 30,
                                                        width: 30,
                                                        borderRadius: 15,
                                                        marginRight: 5,
                                                        justifyContent: 'center',
                                                        alignContent: 'center',
                                                        backgroundColor: contact.color,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            color: 'white',
                                                            textAlign: 'center'
                                                        }}>
                                                        {initials}
                                                    </Text>
                                                </View>
                                            )
                                        }}>

                                    </FlatList>

                                </View>)}}
                    />
            <TouchableOpacity 
                style={styles.newItemButton}
                onPress={() => {
                    setPopoverVisibility(true);
                }}>
                <Text style={styles.newItemButtonText}>+</Text>
            </TouchableOpacity>
            <View style = {styles.contactsView}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    marginLeft: '2%',
                    marginRight: '2%',
                }}>
					{/* changed splitContacts to addedContacts*/}
					<FlatList
                        horizontal
                        style={styles.contactFlatList}
																				
                        contentContainerStyle={styles.contactFlatListContainer} data={addedContacts}
                        keyExtractor={(item, index) => item + index}
                        renderItem={ ({item, index}) => {
                            let initials = getInitials(item);
                            let borderRadius = selectedContact == index ? 2 : 0;
                            return (<TouchableOpacity 
                                    style = {[styles.contactFlatListItem, {backgroundColor : item.color, borderWidth : borderRadius}]}
                                    onPress ={() => {
                                        setSelectedContact(selectedContact == index ? -1 : index);
                                        console.log(`selected index = ${index}`)
                                    }}>
                                <Text>
                                    {initials}
                                </Text>
                            </TouchableOpacity>)
                        }}>
                    </FlatList>

                    <TouchableOpacity
						onPress={() => {
							setContactPopoverVis(true);
							console.log('Add contacts');
						}}>
                        <Text>
                            Add Contact
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  titleLabel: {
    marginTop: 20,
    fontSize: 30,
    textAlign: 'center',
    width: '100%'
  }, 
  titleInput: {
    margin: 40, 
    fontSize: 25,
    width: '80%',
  },
  popoverTitleLabel: {
    marginTop: 20,
    fontSize: 30,
    textAlign: 'center',
    width: '100%'
  }, 
  itemNameInput: {
    margin: 15, 
    fontSize: 20,
    width: '80%',
  },
  itemPriceInput: {
    margin: 15, 
    fontSize: 20,
    width: '50%',
  },
  buttonContainer : {
    width:  '100%',
    textAlign: 'center',
    alignItems: 'center',
  }, 
  button: {
    margin: 15,
    fontSize: 30,
    width: '50%',
    backgroundColor: 'purple',
    borderRadius: 5,
  },
  buttonText: {
    padding: 10, 
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  itemContact: {

  },
  flatList: {
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%',
  },
  listFullView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listItemView: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    marginRight: '5%'
 },
  listItemName: {
    fontSize: 18,
  },
  listItemPrice: {
    fontSize: 18,
  },
  popover: {
    position: 'absolute',
    zIndex: 20,
    left: '10%',
    right: '10%',
    marginTop: '30%',
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 2, height: 2}
  },
  contactPopover: {
    textAlign: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 20,
    left: '10%',
    right: '10%',
    marginTop: '30%',
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {width: 2, height: 2}
  },
  newItemButton: {
    // position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'blue',
    height: 50,
    width: 50,
    borderRadius: 25,
    left: '80%',
    bottom: 20,
  },
  newItemButtonText: {
      color: 'white',
      fontSize: 30,
      margin: 0,
      padding: 0,
      marginBottom: 4,
      marginLeft: 2,
  },
  contactsView: {
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '10%',
  },
  contactFlatList: {
    flexDirection: 'row',
    width: '70%',
  },
  contactFlatListContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: '3%',
  },
  addContactFlatListItem: {
	flex:1,
	backgroundColor: 'white',
    height: 50,
    width: 150,
    borderRadius: 30,
	padding:2,
	margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactFlatListItem: {
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactFlatListText: {
    fontSize: 25,
    color: 'white',
  }
});