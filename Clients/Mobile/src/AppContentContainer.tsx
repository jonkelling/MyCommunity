import React from "react";
import { Image, Platform } from "react-native";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../node_modules/linq/linq";
import * as actions from "./actions/index";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import PostGridView from "./components/posts/PostGridView";
import PostList from "./components/posts/PostList";
import DemoScreen from "./DemoScreen";
import { ScreenId } from "./screens/index";
import { Screen, Text, View } from "./ui";

class AppContentContainer extends React.Component<{
    app: any, accessToken: string, actions: any,
    email: string,
    entities: any,
    navigator: any,
}, { loadedPosts: boolean }> {
    constructor(props) {
        super(props);
        this.state = { loadedPosts: false };
    }
    public componentWillMount() {
        this.loadCurrentUserIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        this.loadCurrentUserIfNeeded(nextProps);
        this.setupScreen(nextProps);
    }
    private setupScreen(props) {
        if (!props.entities.communities) {
            return;
        }
        const currentUser = props.entities && props.entities.users && Enumerable
            .from(props.entities.users)
            .select((x) => x.value)
            .singleOrDefault((x) => x.email === props.email);
        if (!currentUser) {
            return;
        }
        const currentCommunity = props.entities.communities[currentUser.communityId];
        if (!currentCommunity) {
            return;
        }
        this.props.navigator.setTitle({
            subtitle: currentCommunity.name,
        });
    }
    public render() {
        if (this.props.app.loading.app) {
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
            <Screen>
                <View style={styles.container}>
                    <PostList navigator={this.props.navigator} />
                    {/*<PostGridView navigator={this.props.navigator} />*/}
                    {/*<PostListViewCards navigator={this.props.navigator} />*/}
                    {this.props.children}
                </View>
            </Screen>
        );
    }
    private loginIfNeeded(props: any) {
        if (props.app.loading.app) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (!props.app.idToken) {
            AuthService.getRefreshToken()
                .then((token) => {
                    if (!token) {
                        this.props.actions.login();
                    }
                })
                .catch((error) => {
                    throw new Error(JSON.stringify(error));
                });
        }
    }
    private loadCurrentUserIfNeeded(props: any) {
        if (!props.email) {
            return; // shouldn't be logged in here.
        }
        if (props.app.loading.users) {
            console.log("Users is currently loading, skipping loadCurrentUser.");
            return;
        }
        const currentUser = props.entities && props.entities.users && Enumerable
            .from(props.entities.users)
            .select((x) => x.value)
            .singleOrDefault((x) => x.email === props.email);
        if (!currentUser) {
            props.actions.loadCurrentUser();
            return;
        }
        if (this.state.loadedPosts) {
            return;
        }
        props.actions.loadCommunity(currentUser.communityId);
        props.actions.loadNewestPosts(currentUser.communityId);
        this.setState({ loadedPosts: true });
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
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContentContainer);
