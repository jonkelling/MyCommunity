import React from "react";
import { ViewProperties } from "react-native";
import View from "./View";

export default class Overlay extends React.Component<{}, {}> {
    public render() {
        return <View {...this.props} />;
    }
}
