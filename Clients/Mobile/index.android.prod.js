import 'core-js';
import React from 'react';
import { AppRegistry, View, Text } from 'react-native'
import App from './build/App.prod'

// export default class Index extends React.Component {
//     render() {
//         return <View><Text>Hello world</Text></View>;
//     }
// }

// AppRegistry.registerComponent('mycommunity', () => Index)

const app = new App();