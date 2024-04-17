import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable, SafeAreaView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import * as SecureStore from 'expo-secure-store';


export default function LogPushups({ setURL, editingIndex=undefined }) {
    const numberList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

    const [date, setDate] = React.useState(new Date());
    const [pushupsLogged, setPushupsLogged] = React.useState(numberList[0]);

    React.useEffect(() => {
        async function getData() {
            let myPushups = await SecureStore.getItemAsync("pushups")
            myPushups = await JSON.parse(myPushups)
            setDate(new Date(myPushups[editingIndex].date))
            setPushupsLogged(myPushups[editingIndex].count)
        }
        if (editingIndex === undefined) {
            return
        }
        getData()
    }, [editingIndex, setURL])

    async function handlePressLog() {
        try {
            let updatedPushups = await SecureStore.getItemAsync("pushups")
            updatedPushups = await JSON.parse(updatedPushups)

            if (editingIndex === undefined) {
                updatedPushups.push({
                    date: date,
                    count: parseInt(pushupsLogged)
                })
            } else {
                updatedPushups[editingIndex] = {
                    date: date,
                    count: parseInt(pushupsLogged)
                }
            }
            await SecureStore.setItem("pushups", JSON.stringify(updatedPushups))
            setURL("/")
        } catch (err) {
            alert(err)
            setURL("/")
        }
    }

    const handlePressDelete = () =>
        Alert.alert('Alert Title', 'My Alert Msg', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: deleteLog },
        ]);

    async function deleteLog() {
        try {
            let updatedPushups = await SecureStore.getItemAsync("pushups")
            updatedPushups = await JSON.parse(updatedPushups)
            updatedPushups = updatedPushups.filter((item, index) => index !== editingIndex)
            await SecureStore.setItem("pushups", JSON.stringify(updatedPushups))
            setURL("/")
        } catch (err) {
            alert(err)
            setURL("/")
        }
    }

    return <SafeAreaView className="mt-10 ml-5">
    <View className="flex gap-2">
        <View className="flex flex-row justify-between items-center">
            <Text className="text-2xl">{editingIndex === undefined ? "Log Pushups" : "Edit log"}</Text>
            <Pressable onPress={async () => setURL("/")}>
                <Text className="mr-5 text-red-500">Back</Text>
            </Pressable>
        </View>

        <Text className=" text-gray-600">Date</Text>
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="datetime"
            display='spinner'
            is24Hour={true}
            onChange={(event, selectedDate) => setDate(selectedDate)}
        />

        <Text className="text-gray-600">Amount</Text>
        
        <Picker
            selectedValue={pushupsLogged}
            onValueChange={(itemValue, itemIndex) => setPushupsLogged(itemValue)}>
            {
                numberList.map((number, index) => { return <Picker.Item key={index} label={number} value={number} /> })
            }
        </Picker>
        
        <View className="flex flex-row justify-around">
            <View className="overflow-hidden w-20 rounded-md self-center">
                <Pressable onPress={handlePressLog}>
                    <Text className="rounded-md p-2 text-lg text-white bg-red-400 text-center">Log</Text>
                </Pressable>
            </View>
            {
            editingIndex !== undefined && (
                <Pressable onPress={handlePressDelete}>
                    <Text className="rounded-md p-2 text-lg text-red-400 text-center">Delete</Text>
                </Pressable>
            )
            }
        </View>
    </View>
    </SafeAreaView>
}