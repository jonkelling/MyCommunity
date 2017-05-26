import React from "react";
import { Navigation } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./actions/index";
import appActions from "./appActions";
import appNavigation from "./appNavigation";
import AuthService from "./auth/AuthService";
import * as jwtHelper from "./auth/jwtHelper";
import Screen from "./components/Screen";
import Text from "./components/Text";
import View from "./components/View";
import { ScreenId } from "./screens/index";

interface ILoadingScreenProps {
    app: any;
    entities: any;
    profile: any;
    actions: any;
}

class LoadingScreen extends React.Component<ILoadingScreenProps, { done: boolean }> {
    constructor(props) {
        super(props);
        this.state = { done: false };
    }
    public componentWillMount() {
        this.loginIfNeeded(this.props);
    }
    public componentWillReceiveProps(nextProps: any) {
        this.loginIfNeeded(nextProps);
    }
    private loginIfNeeded(props: any) {
        console.log(`loadingscreen: ${this.state.done}`);
        // if (this.state.done) {
        //     return;
        // }
        console.log("screen: " + this.props.app.screenId);
        if (this.props.app.screenId !== ScreenId.Loading) {
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
                if (!props.app.currentUser.communityId) {
                    console.log("goto screen nocommunityassigned");
                    props.actions.startNoCommunityAssigned();
                }
                else {
                    console.log("goto screen backtoapp");
                    props.actions.backToApp();
                }
            }
        }
    }
    public render() {
        return <Screen styleName="paper" style={{ paddingTop: 100, paddingHorizontal: 20 }}>
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
        ...bindActionCreators(appNavigation, dispatch),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
