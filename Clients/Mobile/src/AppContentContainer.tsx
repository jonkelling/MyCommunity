import React from "react";
import { InteractionManager } from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../node_modules/linq/linq";
import * as actions from "./actions/index";
import appActions from "./appActions";
import appNavigation from "./appNavigation";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import PostGridView from "./components/posts/PostGridView";
import PostList from "./components/posts/PostList";
import DemoScreen from "./DemoScreen";
import { ScreenId } from "./screens/index";
// tslint:disable-next-line:no-var-requires
import { Button, Image, Text, View } from "./ui";

class AppContentContainer extends React.Component<{
    app: any, accessToken: string, actions: any,
    email: string,
    entities: any,
    navigator: any,
}, {
        loadedPosts: boolean,
        startingUp: boolean,
    }> {
    constructor(props) {
        super(props);
        this.state = {
            loadedPosts: false,
            startingUp: true,
        };
    }
    public componentWillMount() {
        if (this.props.app.screenId !== ScreenId.Home) {
            return;
        }
        this.loginIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        if (this.props.app.screenId !== ScreenId.Home) {
            return;
        }
        this.loginIfNeeded(nextProps);
        this.setupScreen(nextProps);
    }
    private setupScreen(props) {
        if (this.state.startingUp || !props.email) {
            return;
        }
        const currentUser = props.entities && props.entities.users && Enumerable
            .from(props.entities.users)
            .select((x) => x.value)
            .singleOrDefault((x) => x.email === props.email);
        if (!props.entities.communities ||
            -1 === Object.keys(props.entities.communities).indexOf(`${currentUser.communityId}`)) {
            // InteractionManager.runAfterInteractions(() => {
            //     this.props.actions.loadCommunity(currentUser.communityId);
            //     this.props.actions.loadNewestPosts(currentUser.communityId);
            // });
            return;
        }
        console.log(`${JSON.stringify(Object.keys(props.entities.communities))}`);
        console.log(`indexof: ${Object.keys(props.entities.communities).indexOf(`${currentUser.communityId}`)}`);
        if (-1 === Object.keys(props.entities.communities).indexOf(`${currentUser.communityId}`)) {
            console.log(`    ... community not found`);
            console.log(`    ... bailing`);
            return;
        }
        const currentCommunity = props.entities.communities[currentUser.communityId];
        console.log(`setting titleto ${currentCommunity.name}`);
        this.props.navigator.setTitle({ title: currentCommunity.name });
    }
    public render() {
        if (this.props.app.loading.app) {
            return null;
        }
        console.log(`${!!this.props.email}`);
        console.log(`${!!this.props.app.currentUser}`);
        console.log(`${!!this.props.entities.communities}`);
        if (!this.props.email ||
            !this.props.app.currentUser ||
            !this.props.entities.communities) {
            return null;
        }
        const ProfileImage = () => {
            if (!this.props.app.profile) { return null; }
            if (!this.props.app.profile.picture) { return null; }
            return <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: this.props.app.profile.picture }} />;
        };

        // Old stuff
        // <ProfileImage />
        // <Text>{this.props.app.profile && this.props.app.profile.email || "no email"}</Text>
        // <Button
        //     onPress={() => this.props.actions.logout()}
        //     title="Logout Button">Logout</Button>

        return (
            <View style={styles.container}>
                <PostList navigator={this.props.navigator} />
                {/*<PostGridView navigator={this.props.navigator} />*/}
                {this.props.children}
            </View>
        );
    }
    private loginIfNeeded(props: any) {
        if (props.app.loading.app) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (props.app.loading.app || props.app.loggingIn) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (!props.app.idToken) {
            setTimeout(() => props.actions.login(), 1000);
        }
        else if (jwtHelper.isTokenExpired(props.app.idToken)) {
            if (!props.app.refreshingToken) {
                props.actions.refreshToken();
            }
        }
        else {
            if (props.app.currentUser) {
                this.setState({ startingUp: false });
                if (!props.app.currentUser.communityId) {
                    console.log("goto screen nocommunityassigned");
                }
                else {
                    console.log("goto screen backtoapp");
                }
            }
        }
    }
}

const styles: any = {
    container: {
        backgroundColor: "transparent",
        flex: 1,
        // ...Platform.select({
        //     ios: {
        //         // paddingTop: 64,
        //         // paddingBottom: 49,
        //     },
        // }),
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
};

const mapStateToProps = (state: any, ownProps: any) => {
    return ({
        accessToken: "",
        app: state.app,
        email: (state.app.profile && state.app.profile.email),
        entities: state.entities,
    });
};

const mapDispatchToProps = (dispatch: any) => ({
    actions: {
        login: () => dispatch({ type: actions.AUTH0_LOGIN }),
        logout: () => dispatch({ type: actions.AUTH0_LOGOUT }),
        ...bindActionCreators(appActions, dispatch),
        ...bindActionCreators(appNavigation, dispatch),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContentContainer);
