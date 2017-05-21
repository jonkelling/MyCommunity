import React from "react";
import { TextProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export interface ISubtitlePropertiesWrapper extends TextProperties {
    styleName?: string;
}

export default class Subtitle extends React.Component<ISubtitlePropertiesWrapper, {}> {
    public render() {
        return <Shoutem.Subtitle {...this.props} />;
    }
}
