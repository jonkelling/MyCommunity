import React from "react";
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import PostAuthor, { IPostAuthor } from "./PostAuthor";
import PostContent from "./PostContent";
import PostHeadline from "./PostHeadline";

interface IPostVm {
    post: {
        id: number,
        headline: string,
        content: string,
        createdDateTime: string,
    };
    author: IPostAuthor;
    contentStyle: TextStyle;
    headlineStyle: TextStyle;
    style: ViewStyle;
    viewPost: any;
}

export default class Post extends React.Component<IPostVm, {}> {
    public render() {
        return <View style={this.props.style}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.props.viewPost.bind(this, this.props.post.id)}>
                <PostHeadline text={this.props.post.headline} style={this.props.headlineStyle} />
                <Text>{new Date(this.props.post.createdDateTime).toLocaleString()}</Text>
                <PostAuthor author={this.props.author} />
                <PostContent content={this.props.post.content} style={this.props.contentStyle} />
            </TouchableOpacity>
        </View>;
    }
}
