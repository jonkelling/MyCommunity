import React from "react";
import {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Provider } from "react-redux";
import { Store } from "redux";
import AppContentContainer from "./AppContentContainer";
import storeConfig from "./store/ConfigureStore.dev";

export default class App extends React.Component<{}, {}> {
    private store: Store<any>;
    constructor(props) {
        super(props);
        this.store = storeConfig({});
    }
    public render() {
        return (
            <Provider store={this.store}>
                <AppContentContainer store={this.store}>
                </AppContentContainer>
            </Provider>
        );
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

AppRegistry.registerComponent("mycommunity", () => App);
