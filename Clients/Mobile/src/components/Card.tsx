import React from "react";
import { ViewProperties } from "react-native";
import View from "./View";

export default class Card extends React.Component<any, {}> {
    public render() {
        return <View {...this.props} style={{ paddingTop: 23 }} />;
    }
}
