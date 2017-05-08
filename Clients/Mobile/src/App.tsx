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

import { Navigation } from "react-native-navigation";

import { registerScreens } from "./screens/index";

const store = storeConfig({});

const navigatorStyle = {
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarTextColor: "white",
    navBarButtonColor: "white",
    statusBarTextColorScheme: "light",
    drawUnderTabBar: true,
};

registerScreens(store, Provider); // this is where you register all of your app's screens

/*export default class App extends React.Component<{}, {}> {
    private store: Store<any>;
    constructor(props) {
        super(props);
        this.store = store;
    }
    public render() {
        return (
            <Provider store={this.store}>
                <AppContentContainer store={this.store}>
                </AppContentContainer>
            </Provider>
        );
    }
}*/

export default class App {
    constructor() {
        setTimeout(() => this.startApp(), 0);
    }

    private startApp() {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    label: "Posts",
                    screen: "app.PostList",
                    // icon: iconsMap["ios-film-outline"],
                    // selectedIcon: iconsMap["ios-film"],
                    title: "Posts",
                    navigatorStyle,
                    navigatorButtons: {
                        rightButtons: [
                            {
                                title: "Search",
                                id: "search",
                                // icon: iconsMap["ios-search"],
                            },
                        ],
                    },
                },
            ],
            tabsStyle: {
                tabBarButtonColor: "white",
                tabBarSelectedButtonColor: "white",
                tabBarBackgroundColor: "black",
            },
        });
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
