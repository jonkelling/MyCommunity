// tslint:disable-next-line:no-var-requires
const moment = require("moment");
import React from "react";
import { Image, ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { Navigator, NavigatorStyle } from "react-native-navigation";
import { connect } from "react-redux";
import { Divider, Screen, Subtitle, Text, Title } from "../../ui";
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
        return <View style={{ flex: 0, height: 500 }}>
            <ScrollView style={{ height: 500, flex: 0 }}>
                <Image
                    // styleName="large-banner"
                    source={{
                        uri: this.props.post.headlineImageUrl ||
                        "http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg",
                    }} />
                <View style={{ flex: 0, padding: 20, paddingBottom: 39 }}>
                    <Title style={{ fontWeight: "600" }}>{this.props.post.headline}</Title>
                    <Text>{moment(this.props.post.createdDateTime).fromNow()}</Text>
                    {/*<PostAuthor author={this.props.author} />*/}
                    <Divider />
                    <Text
                        style={{
                            flex: 0,
                        }}>{this.props.post.content}. {this.props.post.content}.</Text>
                </View>
            </ScrollView>
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
