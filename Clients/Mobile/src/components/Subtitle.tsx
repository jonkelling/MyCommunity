import React from "react";
import { TextProperties } from "react-native";
import Text from "./Text";

export default class Subtitle extends React.Component<TextProperties, {}> {
    public render() {
        return <Text {...this.props} />;
    }
}
