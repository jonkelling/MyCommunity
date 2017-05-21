import React from "react";
import { connect } from "react-redux";
import Text from "./components/Text";
import View from "./components/View";

interface ILoadingScreenProps {
    app: any;
    entities: any;
    profile: any;
}

class LoadingScreen extends React.Component<ILoadingScreenProps, {}> {
    public render() {
        return <View>
            <Text>stuff</Text>
        </View>;
    }
}

function mapStateToProps(state) {
    return {
        app: state.app,
        entities: state.entities,
        profile: state.app && (state.app.profile || {}),
    };
}

export default connect(mapStateToProps)(LoadingScreen);
