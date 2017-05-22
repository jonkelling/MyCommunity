import React from "react";
import { TextProperties } from "react-native";
import Text from "./Text";

export default class Title extends React.Component<TextProperties, {}> {
    public render() {
        return <Text {...this.props} style={{ fontFamily: "System", fontSize: 20, ...this.props.style }} />;
    }
}
