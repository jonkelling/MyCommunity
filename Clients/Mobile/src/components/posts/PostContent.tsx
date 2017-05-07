import React from "react";
import { Text, TextStyle } from "react-native";

export default class PostContent extends React.Component<{ content: string, style: TextStyle }, {}> {
    public render() {
        return (
            <Text style={this.props.style} numberOfLines={2}>
                {this.props.content}
            </Text>
        );
    }
}
