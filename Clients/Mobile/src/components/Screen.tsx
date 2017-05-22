import React from "react";
import { ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export interface IScreenPropertiesWrapper extends ViewProperties {
    styleName?: string;
}

export default class Screen extends React.Component<IScreenPropertiesWrapper, {}> {
    public render() {
        return <Shoutem.Screen {...this.props} />;
    }
}
