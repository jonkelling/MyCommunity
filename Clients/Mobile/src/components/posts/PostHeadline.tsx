import React from "react";
import { Text } from "react-native";

export default class PostHeadline extends React.Component<{ text: string }, {}> {
    public render() {
        return <Text>{this.props.text}</Text>;
    }
}
