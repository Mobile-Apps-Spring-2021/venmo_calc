import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

function generateVenmoLink(contact, description, amount) {
    return (`venmo://paycharge?txn=charge&recipients=${contact}&amount=${amount}&note=${description}`)
}

export default function RequestScreen(props) {
    const [vRequests, setVRequests] = useState([{contact : 'curtis-aaron', amount : 10.99, desc : 'food', selected : false}]);
    useEffect(() => {
        console.log('configuring requests');
        console.log(`contacts = ${props.route.params.contacts}`)
        console.log(`items = ${JSON.stringify(props.route.params.items)}`)
        console.log(`total = ${props.route.params.total}`)
        console.log(`receipt name = ${props.route.params.receiptName}`)
        let venmoRequests = [];
        let contacts = props.route.params.contacts;
        let splitTotal = !props.route.params.splitByItem;
        let items = props.route.params.items;
        contacts.forEach((element, index) => {
            var amount = 0;
            if (splitTotal) {
                amount = props.route.params.total / contacts.length;
            } else {
                items.filter(element => element.contacts.indexOf(index) != -1).forEach(element => {
                    amount += Number(element.price) / element.contacts.length;
                })
            }
            venmoRequests.push({
                contact : element.venmoUsername,
                amount : amount.toFixed(2),
                desc : `${props.route.params.receiptName}`,
                selected : false,
            });
        });
        console.log(JSON.stringify(venmoRequests));
        setVRequests(venmoRequests);
    }, []);
    return(
        <View style = {styles.container}>
            <FlatList
                style={styles.list}
                data={vRequests}
                keyExtractor={(item, index) => item+index.toString()}
                renderItem={({item, index}) => {
                    return(
                        <TouchableOpacity
                            style={[styles.listItem, item.selected && {
                                borderWidth: 2,
                                borderRadius: 5,
                            }]}
                            onPress={()=>{
                                setVRequests(newItems => {
                                    return newItems.map((item, id) => {
                                        if (id === index) {
                                            item.selected = true
                                        }
                                        return item;
                                    });
                                });
                                Linking.openURL(generateVenmoLink(item.contact, item.desc, item.amount));
                            }}>
                            <Text
                                style={styles.listText}
                            >
                                {item.contact} 
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
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
  list: {
    marginTop: '5%',
  },
  listItem: {
    marginTop: 10
  },
  listText: {
    fontSize: 20,
    padding: 5,
  }
});