import React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Navigator, NavigatorStyle } from "react-native-navigation";
import { connect } from "react-redux";
import { IPostVm } from "./Post";
import PostAuthor, { IPostAuthor } from "./PostAuthor";
import PostContent from "./PostContent";
import PostHeadline from "./PostHeadline";

interface IPostDetailVm extends IPostVm {
    navigator: Navigator;
}

class PostDetail extends React.Component<IPostDetailVm, {}> {
    private static navigatorStyle: NavigatorStyle = {
        navBarHideOnScroll: false,
        navBarTranslucent: true,
        drawUnderNavBar: false,
        navBarTextColor: "black",
        navBarButtonColor: "black",
        statusBarTextColorScheme: "dark",
        drawUnderTabBar: false,
    };
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    public render() {
        return <View style={{
            backgroundColor: "transparent",
            flex: 1,
        }}>
            <PostHeadline text={this.props.post.headline} style={this.props.headlineStyle} />
            <Text>{new Date(this.props.post.createdDateTime).toLocaleString()}</Text>
            <PostAuthor author={this.props.author} />
            <PostContent content={this.props.post.content} style={this.props.contentStyle} />
        </View>;
    }
    private onNavigatorEvent(event) {
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
