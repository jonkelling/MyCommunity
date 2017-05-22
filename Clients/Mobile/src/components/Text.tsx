import React, { ComponentState } from "react";
import { Text as RNText, TextProperties } from "react-native";

export default class Text extends React.Component<any, {}> {
    public render() {
        return <RNText {...this.props} style={{ ...this.props.style, fontFamily: "System" }} />;
    }
}
