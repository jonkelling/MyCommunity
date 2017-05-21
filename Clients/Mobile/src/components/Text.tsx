import React from "react";
import { TextProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const { Text } = require("@shoutem/ui");

export interface ITextPropertiesWrapper extends TextProperties {
    styleName?: string;
}

export default class TextWrapper extends React.Component<ITextPropertiesWrapper, {}> {
    public render() {
        return <Text {...this.props} style={{ ...this.props.style, fontFamily: "System" }} />;
    }
}
