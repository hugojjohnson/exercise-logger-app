import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable, Image, FlatList, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        alert("🔐 Here's your value 🔐 \n" + result);
    } else {
        alert('No values stored under that key.');
    }
}

export default function Home({ setURL }) {
    const [pushups, setPushups] = React.useState(20)
    const [dailyPushups, setDailyPushups] = React.useState(10)
    const [settings, setSettings] = React.useState(false)

    React.useEffect(() => {
        async function getData() {
            try {
                let myPushups = await SecureStore.getItemAsync("pushups")
                if (myPushups === null) {
                    myPushups = "[]"
                    await SecureStore.setItemAsync("pushups", "[]")
                }
                myPushups = await JSON.parse(myPushups)
                let totalPushups = myPushups.reduce((accumulator, currentValue) => accumulator + currentValue.count,
                    0)
                setPushups(totalPushups)

                const todayDate = new Date().toISOString().slice(0, 10); // Extract YYYY-MM-DD format
                let totalDailyPushups = myPushups.filter(myCoolItem => {
                    return new Date(myCoolItem.date).toISOString().slice(0, 10) === todayDate
                })
                totalPushups = totalDailyPushups.reduce((accumulator, currentValue) => accumulator + currentValue.count,
                    0)
                setDailyPushups(totalPushups)
            } catch (err) {
                alert(err)
            }
        }
        getData()
    }, [setURL])

    // SecureStore.setItem("pushups", "[]")

    function settingsHTML() {
        if (!settings) {
            return
        }
        return <View className="absolute z-10 top-8 right-14 shadow-lg w-40 bg-white border-[1px] border-gray-200 rounded-lg p-2">
            <FlatList className="flex"
                data={[
                    { key: 'Reports' },
                    { key: 'Export to CSV' },
                    { key: 'Settings' },
                    { key: 'IDK' },
                ]}
                renderItem={({ item }) => {
                    return <Pressable onPress={() => setURL("/")}>
                        <Text className="text-black text-lg py-1">{item.key}</Text>
                    </Pressable>
                }}
            />
        </View>

    }


    return <View className="h-screen w-full flex flex-col justify-center items-center">
        <Pressable className="absolute top-8 right-3" onPress={() => setSettings(!settings)}>
            <Image className="w-6 h-6" source={require("./../images/settings-icon.png")} />
        </Pressable>
        { settingsHTML() }
        <Text className="text-lg">Pushups completed so far</Text>
        <Text className="text-2xl mb-20">{pushups}</Text>

        <Text className="text-lg">Pushups completed today</Text>

        <ImageBackground className="h-16 aspect-square m-3" source={require("./../images/streak.png")} resizeMode='contain'>
            <Text className="text-2xl m-auto pt-6">{dailyPushups}</Text>
        </ImageBackground>

        <View className="overflow-hidden rounded-md">
            <Pressable onPress={() => {
                setURL("/log")
            }}>
                <Text className="rounded-lg p-3 text-2xl text-white bg-red-400">
                    Log More
                </Text>
            </Pressable>
        </View>

        <View className="overflow-hidden rounded-md mt-5">
            <Pressable onPress={() => {
                setURL("/past")
            }}>
                <Text className="rounded-lg p-3 text-lg text-red-400">
                    View logs
                </Text>
            </Pressable>
        </View>
    </View>
}
