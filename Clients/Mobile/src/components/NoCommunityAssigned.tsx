import React from "react";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "../appActions";
import appNavigation from "../appNavigation";
import { isTokenExpired } from "../auth/jwtHelper";
import { ColorTheme } from "../constants/index";
import { community, communityList } from "../schemas";
import { ScreenId } from "../screens/index";
import * as styles from "../styles";

import {
    Button,
    Card,
    Divider,
    Heading,
    Icon,
    Image,
    Overlay,
    Screen,
    TextInput,
    Tile,
    // tslint:disable-next-line:no-var-requires
} from "../ui";

import { Navigation } from "react-native-navigation";
import Subtitle from "./Subtitle";
import Text from "./Text";
import Title from "./Title";
import View from "./View";

// tslint:disable-next-line:no-var-requires
const img = require("../../images/clouds.jpg");

class NoCommunityAssigned extends React.Component<{
    app: any,
    entities: any,
    profile: any,
}, {}> {
    private loadCurrentUserIntervalId;

    public componentWillReceiveProps(nextProps: any) {
        if (this.props.app.screenId !== ScreenId.NoCommunityAssigned) {
            return;
        }
    }

    public componentWillUnmount() {
        console.log("Clearing timeout for loading current user.");
        clearInterval(this.loadCurrentUserIntervalId);
    }

    public render() {
        const ViewWithWhiteBackground = (props) => <View style={{
            backgroundColor: "#ffffff33",
            padding: 20,
            marginHorizontal: -20,
        }}>
            {props.children}
        </View>;

        const BoldText = (props) => <Text style={{ color: "black", fontWeight: "bold" }}>
            {props.children}
        </Text>;

        const { width, height } = Dimensions.get("window");

        const givenName =
            this.props.app.profile &&
            this.props.app.profile.extraInfo &&
            this.props.app.profile.extraInfo.given_name;

        return <Screen>
            <Image source={img} style={{ width, height }}>
                <Tile>
                    <View styleName="content" style={{ flex: 0 }}>
                        <ViewWithWhiteBackground>
                            <Title>Hi <Title style={{ fontWeight: "800" }}>{givenName}!  </Title>
                                You're almost there!</Title>
                        </ViewWithWhiteBackground>
                        <ViewWithWhiteBackground>
                            <Text style={{ color: "black", alignSelf: "flex-start" }}>
                                <BoldText>NOTICE: </BoldText>
                                You cannot use this app unless
                                your property has an account.
                            </Text>
                        </ViewWithWhiteBackground>
                        <ViewWithWhiteBackground>
                            <Text style={{ color: "black", alignSelf: "flex-start" }}>
                                <BoldText>NEXT: </BoldText>
                                You need to contact your
                                community's owner to activate your
                                account in the My Community app.
                                This is usually your property manager
                                or landlord. You only need to provide
                                them with your email address: <BoldText>
                                    {this.props.profile.email}</BoldText>.
                            </Text>
                        </ViewWithWhiteBackground>
                        <ViewWithWhiteBackground>
                            <Text style={{ color: "black", alignSelf: "flex-start" }}>
                                <BoldText>COMING SOON:</BoldText> New ways to
                                start a community and notify community owners of
                                a new account.
                            </Text>
                        </ViewWithWhiteBackground>
                    </View>
                </Tile>
            </Image>
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

export default connect(mapStateToProps)(NoCommunityAssigned);
