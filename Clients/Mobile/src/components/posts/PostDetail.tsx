// tslint:disable-next-line:no-var-requires
const moment = require("moment");
import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Navigator, NavigatorStyle } from "react-native-navigation";
import { connect } from "react-redux";
import { Screen, ScrollView, Subtitle, Text, Title, View } from "../../ui";
import { Divider, Image } from "../../ui";
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
        if (!this.props.post) {
            return null;
        }
        return <View style={{ flex: 1 }}>
            <ScrollView>
                <Image
                    styleName="large-banner"
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
                        }}>{this.props.post.content}</Text>
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

const mapStateToProps = (state: any, ownProps: any) => {
    console.log("====================================");
    console.log("PostDetail");
    console.log("====================================");
    return {
        post: state.entities && state.entities.posts && state.entities.posts[ownProps.postId],
        // tslint:disable-next-line:max-line-length
        author: state.entities && state.entities.users && state.entities.users[state.entities && state.entities.posts && state.entities.posts[ownProps.postId].author],
    };
};

export default connect(mapStateToProps)(PostDetail);
