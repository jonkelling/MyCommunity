import React from "react";
import { Image, Text, View } from "react-native";

export interface IPostAuthor {
    firstName: string;
    lastName: string;
    imageUrl: string;
}

export default class PostAuthor extends React.Component<{ author: IPostAuthor }, {}> {
    public render() {
        return <View>
            <Text>{this.props.author.firstName} {this.props.author.lastName}</Text>
            <Image source={this.props.author.imageUrl}
                style={{
                    width: 50,
                }} />
        </View>;
    }
}
