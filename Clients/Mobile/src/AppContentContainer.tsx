import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { Store } from "redux";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import DemoScreen from "./DemoScreen";

class AppContentContainer extends React.Component<{ app: any, accessToken: string, store: Store<any> }, {}> {
    private authService: AuthService;
    constructor(props) {
        super(props);
        this.authService = new AuthService(this.props.store);
    }
    public componentWillMount() {
        this.loginIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        this.loginIfNeeded(nextProps);
    }
    public render() {
        if (this.props.app.loading) {
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
                    onPress={() => this.authService.logout()}
                    title="Logout Button">Logout</Button>
                <DemoScreen email={this.props.app.profile && this.props.app.profile.email || null} />
                {this.props.children}
            </View>
        );
    }
    private loginIfNeeded(props: any) {
        if (props.app.loading) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (!props.app.idToken || jwtHelper.isTokenExpired(props.app.idToken)) {
            this.authService.login();
        }
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

const mapStateToProps = (state: any, ownProps: any) => {
    return ({
        accessToken: "",
        app: state.app,
    });
};

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContentContainer);
