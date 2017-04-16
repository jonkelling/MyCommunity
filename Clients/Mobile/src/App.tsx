/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DemoScreen from "./DemoScreen";
import * as storeconfig from "./store/ConfigureStore.dev";

export default class App extends React.Component<{}, { loggedin: boolean }> {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
        };
    }
    public componentWillMount() {
        if (!this.state.loggedin) {
            // tslint:disable-next-line:no-var-requires
            const Auth0Lock = require("react-native-lock");
            const lock = new Auth0Lock({
                clientId: "z3vOGTlPy9haCCwotU_9OuVvsRLSDqjK",
                domain: "mycommunity.auth0.com",
                integrations: {
                    facebook: {
                        permissions: ["public_profile"],
                    },
                },
            });
            lock.show({}, (err, profile, token) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    // console.log(err);
                    return;
                }
                // Authentication worked!
                // tslint:disable-next-line:no-console
                // console.log("Logged in with Auth0!");
                this.setState({ loggedin: true });
            });
        }
    }
    public render() {
        return (
            <View style={styles.container}>
                <DemoScreen />
            </View>
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
