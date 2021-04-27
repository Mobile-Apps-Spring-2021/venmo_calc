import React, {useState, useRef, useEffect} from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const storeContacts = async (contacts) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts))
    } catch (e) {
      console.log('error')
    // saving error
    }
}

const getContacts = async() => {
    try {
        const value = await AsyncStorage.getItem('contacts')
        const json = JSON.parse(value);
        return(json);
    } catch(e) {
        console.log(`found error something ${e}`)
    }
}


export default function Contacts() {
    const ref_input2 = useRef();
    const [price, setPrice] = useState('');
    const [itemName, setItemName] = useState('');
    const [contacts, setContacts] = useState([])
    const [popoverVisibility, setPopoverVisibility] = useState(false);
    const [popoverVisibility2, setPopoverVisibility2] = useState(false);
    const [selectedContact, setSelectedContact] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    

    useEffect(() => {
        getContacts().then((contactsValue) => {
            if (contactsValue != "" && contactsValue != null) {
                setContacts(contactsValue)
            }
        })
    })
    return(
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); console.log('something')}} accessible={false}>
        <SafeAreaView style={styles.container}>
            <TouchableOpacity 
                style={styles.newItemButton}
                onPress={() => {
                    setPopoverVisibility(true);
                }}>
                <Text style={styles.newItemButtonText}>+</Text>
            </TouchableOpacity>
            {popoverVisibility && <View style={styles.popover}>
            <Text
                style = {styles.popoverTitleLabel}
                >New Contact</Text>
            <TextInput
                style = {styles.itemNameInput}          
                returnKeyType = {"next"}
                multiline = {false}
                maxLength = {200}
                placeholder = "Name" 
                value = {itemName}
                onChangeText = { text => {setItemName(text.replace('\n', ''))}}
                onSubmitEditing={ () => {ref_input2.current.focus() }}
                />
            <TextInput
                style = {styles.itemPriceInput}          
                returnKeyType = {"next"}
                multiline = {false}
                autoCapitalize = {'none'}
                autoCorrect = {false}
                placeholder = "Venmo username" 
                value = {price}
                ref={ref_input2}
                onChangeText = { text => {setPrice(text.replace('\n', ''))}}
                />
                <View
                    style = {styles.buttonContainer}>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            var tempContacts = contacts;
                            if (itemName != "" && price != "") {
                                tempContacts .push({
                                    name : itemName,
                                    venmoUsername : price,
                                });
                                setPrice('0.00');
                                setItemName('');
                                setContacts(tempContacts);
                                storeContacts(tempContacts);
                                setPopoverVisibility(false);
                            }
                        }}
                        >
                        <Text
                            style = {styles.buttonText}>
                                New Contact
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            setPrice('');
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
                <FlatList
                    style={styles.flatList}
                    data={contacts}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({item,index}) => { 
                        return (<View style={styles.listFullView}>
                                    <TouchableOpacity 

                                        onPress ={() => {
                                            setSelectedContact(item);
                                            setSelectedIndex(index);
                                            console.log('selected index =', index)
                                            setPopoverVisibility2(true);
                                        }} >
                                    
                                        <View style={styles.listItemView}>
                                            <Text style={styles.listItemName}>{item.name}</Text>
                                            <Text style={styles.listItemPrice}>@{item.venmoUsername}</Text>
                                        </View>
                                    </TouchableOpacity>  

                                    {popoverVisibility2 && <View style={styles.popover}>
                                        <Text
                                            style = {styles.popoverTitleLabel}
                                            >Edit Contact</Text>
                                        <TextInput
                                            style = {styles.itemNameInput}          
                                            returnKeyType = {"next"}
                                            multiline = {false}
                                            maxLength = {200}
                                            placeholder = {selectedContact.name}
                                            value = {itemName}
                                            onChangeText = { text => {setItemName(text.replace('\n', ''))}}
                                            onSubmitEditing={ () => {ref_input2.current.focus() }}
                                            />
                                        <TextInput
                                            style = {styles.itemPriceInput}          
                                            returnKeyType = {"next"}
                                            multiline = {false}
                                            autoCapitalize = {'none'}
                                            autoCorrect = {false}
                                            placeholder = {selectedContact.venmoUsername}
                                            value = {price}
                                            ref={ref_input2}
                                            onChangeText = { text => {setPrice(text.replace('\n', ''))}}
                                            />
                                            <View
                                                style = {styles.buttonContainer}>
                                                <TouchableOpacity 
                                                    style = {styles.button}
                                                    onPress = { () => {
                                                        var tempContacts = contacts;
                                                        if (itemName != "" && price != "") {
                                                            var updatedContact = {name : itemName, venmoUsername : price};
                                                            tempContacts.splice(selectedIndex, 1, updatedContact);
                                                            setPrice('');
                                                            setItemName('');
                                                            setContacts(tempContacts);
                                                            storeContacts(tempContacts);
                                                            setPopoverVisibility2(false);
                                                        }
                                                    }}
                                                    >
                                                    <Text
                                                        style = {styles.buttonText}>
                                                            Update Contact
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style = {styles.button}
                                                    onPress = { () => {
                                                        var tempContacts = contacts;
                                                        tempContacts.splice(selectedIndex, 1)
                                                        setPrice('');
                                                        setItemName('');
                                                        setContacts(tempContacts);
                                                        storeContacts(tempContacts);
                                                        setPopoverVisibility2(false);
                                                        console.log("item deleted at index: " , {selectedIndex})
                                                    }}
                                                    >
                                                    <Text
                                                        style = {styles.buttonText}>
                                                            Delete
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>}


                                </View>)}}
                />
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
    paddingStart: '5%',
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
  flatList: {
      width: '95%',
  },
  listItemView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
 },
  listItemName: {

  },
  listItemPrice: {

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
  newItemButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    backgroundColor: 'blue',
    height: 50,
    width: 50,
    borderRadius: 25,
    right: 20,
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
});