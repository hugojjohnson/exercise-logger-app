import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable, SafeAreaView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import * as SecureStore from 'expo-secure-store';
import LogPushups from './LogPushups';


export default function PastLogs({ setURL }) {
    const [logs, setLogs] = React.useState([])
    const [editingNumber, setEditingNumber] = React.useState(undefined)

    React.useEffect(() => {
        async function getData() {
            let myPushups = await SecureStore.getItemAsync("pushups")
            myPushups = await JSON.parse(myPushups)
            setLogs(myPushups)
        }
        getData()
    }, [setURL])

    // React.useEffect(() => {

    // }, [])
    if (editingNumber !== undefined) {
        return <LogPushups setURL={setURL} editingIndex={editingNumber} />
    }

    return <SafeAreaView className="mt-10 mx-5">
    <ScrollView>
        <View className="flex flex-row justify-between items-center">
            <Text className="my-10 text-2xl">Past Pushups</Text>
            <Pressable onPress={async () => setURL("/")}>
                <Text className="mr-5 text-red-500">Back</Text>
            </Pressable>
        </View>

        <View className="flex gap-2">

        {
            logs.length === 0 ? <Text>Nothing to see</Text> : logs.map((log, index) => {
                return <Pressable key={index} onPress={() => {
                    setEditingNumber(index)
                    }}><View className="overflow-hidden rounded-md">
                    <View className="border-2 border-gray-500 rounded-md p-3">
                        <Text className="text-lg text-gray-600">Date</Text>
                        <Text className="text-lg mb-5">{new Date(log.date).toLocaleString()}</Text>

                        <Text className="text-lg text-gray-600">Pushups</Text>
                        <Text className="text-lg">{log.count}</Text>
                    </View>

                </View></Pressable>
            })
        }

        </View>


            {/* <Pressable onPress={() => {
                setURL("/")
            }}>
                <Text className="my-20">Back</Text>
            </Pressable> */}
    </ScrollView>
    </SafeAreaView>
}