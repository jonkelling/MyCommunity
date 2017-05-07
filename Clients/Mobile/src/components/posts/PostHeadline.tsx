import React from "react";
import { Text, TextStyle } from "react-native";

export default class PostHeadline extends React.Component<{ text: string, style: TextStyle }, {}> {
    public render() {
        return <Text style={this.props.style}>{this.props.text}</Text>;
    }
}
