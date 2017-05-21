import React from "react";
import { ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export interface IViewPropertiesWrapper extends ViewProperties {
    styleName?: string;
}

export default class View extends React.Component<IViewPropertiesWrapper, {}> {
    public render() {
        return <Shoutem.View {...this.props} />;
    }
}
