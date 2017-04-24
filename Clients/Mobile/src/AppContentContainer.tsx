import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";

class AppContentContainer extends React.Component<{ app: any, accessToken: string }, {}> {
    public render() {
        return <View style={styles.container}>{this.props.children}</View>;
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

const mapStateToProps = (state: any) => {
    return ({
        accessToken: "",
        app: state.app,
    });
};

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContentContainer);
