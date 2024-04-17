import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Pressable } from 'react-native'; 
import Home from './components/Home';
import LogPushups from './components/LogPushups';
import PastLogs from './components/PastLogs';


export default function App() {
  const [url, setUrl] = React.useState("/")


  switch (url) {
    case "":
      return <Text>Empty!</Text>
    case "/log":
      return <LogPushups setURL={ setUrl } />
    case "/past":
      return <PastLogs setURL={ setUrl } />
    default:
      return <Home setURL={ setUrl } />
  }
}