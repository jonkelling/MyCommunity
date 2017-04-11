'use strict'

import React from 'react';
import { AppRegistry } from 'react-native'
import App from './build/App'

export default class Index extends React.Component {
    render() {
        return <App/>;
    }
}

AppRegistry.registerComponent('ReactNativeTS', () => Index)