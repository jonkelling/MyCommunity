import React from "react";
import {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { NavigatorStyle } from "react-native-navigation";
import { Provider } from "react-redux";
import { Store } from "redux";
import AppContentContainer from "./AppContentContainer";
import storeConfig from "./store/ConfigureStore.dev";

import appNavigation from "./appNavigation";

import { registerScreens, ScreenId } from "./screens/index";

const store = storeConfig({});

registerScreens(store, Provider);

export default class App {
    constructor() {
        setTimeout(() => {
            store.dispatch(appNavigation.startApp());
            // store.dispatch(appNavigation.startLoadingScreen());
        }, 0);
        // setTimeout(() => this.startNoCommunityAssigned(), 0);
        // setTimeout(() => appNavigation.startLoadingScreen(), 0);
    }
}

const styles: any = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        flex: 1,
        justifyContent: "center",
    },
    instructions: {
        color: "#333333",
        marginBottom: 5,
        textAlign: "center",
    },
    welcome: {
        fontSize: 20,
        margin: 10,
        textAlign: "center",
    },
});

// AppRegistry.registerComponent("mycommunity", () => App);
