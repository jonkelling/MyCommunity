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
import AuthService from "./auth/AuthService";
import DemoScreen from "./DemoScreen";
import storeConfig from "./store/ConfigureStore.dev";

export default class App extends React.Component<{}, { loggedin: boolean, profile: any, token: any }> {
    private store: Store<any>;
    private authService: AuthService;
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            profile: null,
            token: null,
        };
        this.store = storeConfig({});
        this.authService = new AuthService(this.store);
    }
    public componentWillMount() {
        if (!this.state.loggedin) {
            // tslint:disable-next-line:no-var-requires
            this.authService.login((err, profile, token) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    // console.log(err);
                    this.setState({ loggedin: false, profile: null, token: null });
                    return;
                }
                // Authentication worked!
                // tslint:disable-next-line:no-console
                // console.log("Logged in with Auth0!");
                this.setState({ loggedin: true, profile, token });
            });
        }
    }
    public render() {
        const ProfileImage = () => {
            if (!this.state.profile) { return null; }
            if (!this.state.profile.picture) { return null; }
            return <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: this.state.profile.picture }} />;
        };
        return (
            <Provider store={this.store}>
                <AppContentContainer>
                    <View style={styles.container}>
                        <Text>{this.state.profile && this.state.profile.email || "no email"}</Text>
                        <Text>{(this.state.token || {}).toString()}</Text>
                        <ProfileImage />
                        <DemoScreen email={this.state.profile && this.state.profile.email || null} />
                    </View>
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
