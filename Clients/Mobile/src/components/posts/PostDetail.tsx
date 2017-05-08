import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Navigator } from "react-native-navigation";
import { connect } from "react-redux";
import PostAuthor, { IPostAuthor } from "./PostAuthor";
import PostContent from "./PostContent";
import PostHeadline from "./PostHeadline";

interface IPostVm {
    post: {
        headline: string,
        content: string,
        createdDateTime: string,
    };
    author: IPostAuthor;
    contentStyle: TextStyle;
    headlineStyle: TextStyle;
    style: ViewStyle;
    navigator: Navigator;
}

class PostDetail extends React.Component<IPostVm, {}> {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }
    public render() {
        return <View style={this.props.style}>
            <PostHeadline text={this.props.post.headline} style={this.props.headlineStyle} />
            <Text>{new Date(this.props.post.createdDateTime).toLocaleString()}</Text>
            <PostAuthor author={this.props.author} />
            <PostContent content={this.props.post.content} style={this.props.contentStyle} />
        </View>;
    }
    private _onNavigatorEvent(event) {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "close") {
                this.props.navigator.pop();
            }
        }
    }
}

const mapStateToProps = (state: any, ownProps: any) => ({
    post: state.entities.posts[ownProps.postId],
    author: state.entities.users[state.entities.posts[ownProps.postId].author],
});

export default connect(mapStateToProps)(PostDetail);
