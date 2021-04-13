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
    itemsWithTotal.push({name : 'total', price : total})

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

export default function NewReceipt() {
    const ref_input2 = useRef();
    const [price, setPrice] = useState('0.00');
    const [itemName, setItemName] = useState('');
    const [items, setItems] = useState([])
    const [splitContacts, setSplitContacts] = useState([{name : "Curtis Aaron", venmoUsername : "curtis-aaron"}])
    const [popoverVisibility, setPopoverVisibility] = useState(false);
    const [selectedContact, setSelectedContact] = useState(-1);


    useEffect(() => {
        getContacts().then((contactsValue) => {
            if (contactsValue != "" && contactsValue != null) {
                contactsValue.forEach(element => {
                    element.color = getRandomColor();
                });
                setSplitContacts(contactsValue)
            }
        })

    }, [])

    return(
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); console.log('something')}} accessible={false}>
        <SafeAreaView style={styles.container}>
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
                                        keyExtractor={(item, index) => item+index}
                                        renderItem={({item}) => {
                                            let contact = splitContacts[item]
                                            let initials = getInitials(contact);
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
                    <FlatList
                        horizontal
                        style={styles.contactFlatList}
                        contentContainerStyle={styles.contactFlatListContainer} data={splitContacts}
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
                    <TouchableOpacity>
                        <Text>
                            button
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