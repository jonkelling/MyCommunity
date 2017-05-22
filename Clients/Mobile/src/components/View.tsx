import React from "react";
import { View as RNView, ViewProperties } from "react-native";

export default class View extends React.Component<any, {}> {
    public render() {
        return <RNView {...this.props} />;
    }
}
