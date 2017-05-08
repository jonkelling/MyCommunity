import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../node_modules/linq/linq";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import PostList from "./components/posts/PostList";
import DemoScreen from "./DemoScreen";

class AppContentContainer extends React.Component<{
    app: any, accessToken: string, actions: any,
    email: string,
    entities: any,
}, { loadedPosts: boolean }> {
    constructor(props) {
        super(props);
        this.state = { loadedPosts: false };
    }
    public componentWillMount() {
        this.loginIfNeeded(this.props);
        this.loadCurrentUserIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        this.loginIfNeeded(nextProps);
        this.loadCurrentUserIfNeeded(nextProps);
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
        return (
            <View style={styles.container}>
                <ProfileImage />
                <Text>{this.props.app.profile && this.props.app.profile.email || "no email"}</Text>
                <Button
                    onPress={() => this.props.actions.logout()}
                    title="Logout Button">Logout</Button>
                <PostList />
                {this.props.children}
            </View>
        );
    }
    private loginIfNeeded(props: any) {
        if (props.app.loading.app) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (!props.app.idToken || jwtHelper.isTokenExpired(props.app.idToken)) {
            this.props.actions.login();
        }
    }
    private loadCurrentUserIfNeeded(props: any) {
        if (!props.email) {
            return;
        }
        if (props.app.loading.users) {
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

const styles: any = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
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
        login: () => dispatch({ type: "AUTH0_LOGIN" }),
        logout: () => dispatch({ type: "AUTH0_LOGOUT" }),
        ...bindActionCreators(appActions, dispatch),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContentContainer);
