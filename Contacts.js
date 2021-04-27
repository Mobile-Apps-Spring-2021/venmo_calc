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
    const [venmoUsername, setVenmoUsername] = useState('');
    const [contactName, setContactName] = useState('');
    const [contacts, setContacts] = useState([])
    const [popoverVisibility, setPopoverVisibility] = useState(false);
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
            {(popoverVisibility || selectedIndex > 0) && <View style={styles.popover}>
            <Text
                style = {styles.popoverTitleLabel}
                >{selectedIndex > -1 ? "Edit Contact": "New Contact"}</Text>
            <TextInput
                style = {styles.itemNameInput}          
                returnKeyType = {"next"}
                multiline = {false}
                maxLength = {200}
                placeholder = "Name" 
                value = {contactName}
                onChangeText = { text => {setContactName(text.replace('\n', ''))}}
                onSubmitEditing={ () => {ref_input2.current.focus() }}
                />
            <TextInput
                style = {styles.itemPriceInput}          
                returnKeyType = {"next"}
                multiline = {false}
                autoCapitalize = {'none'}
                autoCorrect = {false}
                placeholder = "Venmo username" 
                value = {venmoUsername}
                ref={ref_input2}
                onChangeText = { text => {setVenmoUsername(text.replace('\n', ''))}}
                />
                <View
                    style = {styles.buttonContainer}>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            var tempContacts = contacts;
                            if (contactName != "" && venmoUsername != "") {
                                if(selectedIndex > -1){
                                    var updatedContact = {name : contactName, venmoUsername : venmoUsername};
                                    tempContacts.splice(selectedIndex, 1, updatedContact);
                                }
                                else{
                                    tempContacts .push({
                                        name : contactName,
                                        venmoUsername : venmoUsername,
                                    });
                                }
                                setSelectedIndex(-1)
                                setVenmoUsername('');
                                setContactName('');
                                setContacts(tempContacts);
                                storeContacts(tempContacts);
                                setPopoverVisibility(false);
                            }
                        }}
                        >
                        <Text
                            style = {styles.buttonText}>
                                {selectedIndex > -1 ? "Update ": "Add"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = { () => {
                            if(selectedIndex > -1){
                                var tempContacts = contacts;
                                tempContacts.splice(selectedIndex, 1)
                                setContacts(tempContacts);
                                storeContacts(tempContacts);
                            }
                            setVenmoUsername('');
                            setContactName('');
                            setSelectedIndex(-1);
                            setPopoverVisibility(false);
                        }}
                        >
                        <Text
                            style = {styles.buttonText}>
                                {selectedIndex > -1 ? "Delete ": "Cancel"}
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
                                            setSelectedIndex(index);
                                            setContactName(item.name)
                                            setVenmoUsername(item.venmoUsername)
                                            console.log("selected index: " , selectedIndex)
                                        }} >
                                    
                                        <View style={styles.listItemView}>
                                            <Text style={styles.listItemName}>{item.name}</Text>
                                            <Text style={styles.listItemPrice}>@{item.venmoUsername}</Text>
                                        </View>
                                    </TouchableOpacity>  
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