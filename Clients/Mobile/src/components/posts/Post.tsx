import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import FormattedDateText from "../../components/FormattedDateText";
import PostAuthor, { IPostAuthor } from "./PostAuthor";
import PostContent from "./PostContent";
import PostHeadline from "./PostHeadline";

export interface IPostVm {
    post: {
        id: number,
        headline: string,
        headlineImageUrl: string,
        content: string,
        createdDateTime: string,
        modifiedDateTime: string,
        expireDateTime: string,
    };
    author: IPostAuthor;
    contentStyle: TextStyle;
    headlineStyle: TextStyle;
    style: ViewStyle;
    viewPost: any;
}

const styles: any = StyleSheet.create({
    date: {
        flex: 0,
        alignSelf: "flex-end",
        color: "gray",
        fontSize: 12,
    },
});

export default class Post extends React.Component<IPostVm, {}> {
    public render() {
        return <View style={this.props.style}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.props.viewPost.bind(this, this.props.post.id)}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <PostHeadline text={this.props.post.headline} style={this.props.headlineStyle} />
                    <FormattedDateText style={styles.date}>
                        {this.props.post.createdDateTime}</FormattedDateText>
                </View>
                {/*<PostAuthor author={this.props.author} />*/}
                <PostContent content={this.props.post.content} style={this.props.contentStyle} />
            </TouchableOpacity>
        </View>;
    }
}
