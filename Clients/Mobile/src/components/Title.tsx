import React from "react";
import { TextProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");
import { ITextPropertiesWrapper } from "./Text";

export default class Title extends React.Component<ITextPropertiesWrapper, {}> {
    public render() {
        return <Shoutem.Title {...this.props} style={{ ...this.props.style, fontFamily: "System" }} />;
    }
}
