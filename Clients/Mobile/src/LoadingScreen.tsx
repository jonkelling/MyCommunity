import React from "react";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import * as actions from "./actions/index";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import Screen from "./components/Screen";
import Text from "./components/Text";
import View from "./components/View";

interface ILoadingScreenProps {
    app: any;
    entities: any;
    profile: any;
    actions: {
        login: any,
        refreshToken: any,
    };
}

class LoadingScreen extends React.Component<ILoadingScreenProps, {}> {
    public componentWillMount() {
        this.loginIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        this.loginIfNeeded(nextProps);
    }
    private loginIfNeeded(props: any) {
        if (props.app.loading.app || props.app.loggingIn) {
            // Maybe skip this component until loading is done?
            return;
        }
        if (!props.app.idToken) {
            props.actions.login();
        }
        else if (jwtHelper.isTokenExpired(props.app.idToken)) {
            if (!props.app.refreshingToken) {
                props.actions.refreshToken();
            }
        }
    }
    public render() {
        return <Screen styleName="paper" style={{ paddingTop: 100, paddingHorizontal: 20 }}>
            <Text>Current User:</Text>
            <Text>{`${this.props.app.loading.app}`}</Text>
            <Text>idToken: {this.props.app.idToken}</Text>
            <Text>{this.props.app.currentUser && this.props.app.currentUser.communityId}</Text>
        </Screen>;
    }
}

function mapStateToProps(state) {
    return {
        app: state.app,
        entities: state.entities,
        profile: state.app && (state.app.profile || {}),
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    actions: {
        login: () => dispatch({ type: actions.AUTH0_LOGIN }),
        refreshToken: () => dispatch(appActions.refreshToken()),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
