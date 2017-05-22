import React from "react";
import { ViewProperties } from "react-native";
import View from "./View";

export interface IScreenPropertiesWrapper extends ViewProperties {
    styleName?: string;
}

export default class Screen extends React.Component<any, {}> {
    public render() {
        return <View {...this.props} />;
    }
}
