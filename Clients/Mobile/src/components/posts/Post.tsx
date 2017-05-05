import React from "react";
import { View } from "react-native";
import PostAuthor from "./PostAuthor";
import PostContent from "./PostContent";
import PostHeadline from "./PostHeadline";

interface IPostVm {
    headline: string;
    content: string;
}

export default class Post extends React.Component<{ post: IPostVm }, {}> {
    public render() {
        return <View>
            <PostHeadline text={this.props.post.headline} />
            <PostAuthor />
            <PostContent />
        </View>;
    }
}
