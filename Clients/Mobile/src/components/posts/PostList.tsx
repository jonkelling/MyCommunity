import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import Post from "./Post";

class PostList extends React.Component<IPostListProps, {}> {
    public render() {
        return (
            <View>
                {this.props.posts.map((p) => <Post post={p} />)}
            </View>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        posts: [],
    };
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

interface IPostListProps {
    posts: any[];
}

export default connect(mapStateToProps)(PostList);
