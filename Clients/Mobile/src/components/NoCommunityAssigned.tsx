import React from "react";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { isTokenExpired } from "../auth/jwtHelper";
import { ColorTheme } from "../constants/index";
import { community } from "../schemas";
import * as styles from "../styles";

const {
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
} = require("@shoutem/ui");

import Subtitle from "./Subtitle";
import Text from "./Text";
import Title from "./Title";
import View from "./View";

// tslint:disable-next-line:no-var-requires
const img = require("../../images/clouds.jpg");

class NoCommunityAssigned extends React.Component<{ app: any, entities: any, profile: any }, {}> {
    constructor(props) {
        super(props);
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
                                Next, you need to contact your
                                community's owner to activate your
                                account in the My Community app.
                                This is usually your property manager
                                or landlord. You only need to provide
                                them with your email address: <BoldText>
                                    {this.props.profile.email}</BoldText>.
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
