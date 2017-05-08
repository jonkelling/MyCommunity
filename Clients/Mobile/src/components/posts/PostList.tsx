import isEqual from "lodash.isequal";
import React from "react";
import {
    Button,
    Image, ListView, ListViewDataSource, RefreshControl, StyleSheet, Text,
    TextStyle,
    View,
} from "react-native";
import { Navigator } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../../../node_modules/linq/linq";
import appActions from "../../appActions";
import { UPDATE_CONTACT_INFORMATION } from "../../constants/index";
import Post from "./Post";

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    scrollview: {
        flex: 1,
    },
    headline: {
        fontWeight: "bold",
    },
    content: {
        alignSelf: "auto",
        color: "gray",
    },
});

class PostList extends React.Component<IPostListProps, { postsDataSource: ListViewDataSource, isRefreshing: boolean }> {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isRefreshing: false,
            postsDataSource: ds.cloneWithRows(this.getSortedPostsArray()),
        };
        this._viewPost = this._viewPost.bind(this);
        this._renderSeparator = this._renderSeparator.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }
    public componentWillReceiveProps(nextProps: IPostListProps) {
        if (!isEqual(this.props.posts, nextProps.posts)) {
            const newPosts = this.getSortedPostsArray(nextProps);
            this.setState({
                postsDataSource: this.state.postsDataSource.cloneWithRows(newPosts),
            });
        }
        if (this.props.app.loading.posts && !nextProps.app.loading.posts) {
            this.setState({ isRefreshing: false });
        }
    }
    public render() {
        if (!this.props.posts) {
            return null;
        }
        // TODO: Use accurate communityId
        return (
            <ListView dataSource={this.state.postsDataSource}
                renderRow={(rowData) => (
                    <Post post={rowData}
                        author={this.props.users[rowData.author]}
                        style={styles.row}
                        headlineStyle={styles.headline}
                        contentStyle={styles.content}
                        viewPost={this._viewPost} />
                )}
                renderSeparator={this._renderSeparator}
                onEndReached={() => this.props.actions.loadOlderPosts(1, this.getOldestPostDateTime(), 5)}
                refreshControl={this.getRefreshControl()}
                style={styles.scrollview} />
        );
    }
    private getSortedPostsArray(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .orderByDescending((post) => post.createdDateTime)
            .toArray();
    }
    private getNewestPostDateTime(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .orderByDescending((post) => post.createdDateTime)
            .select((post) => new Date(post.createdDateTime))
            .defaultIfEmpty(new Date())
            .firstOrDefault();
    }
    private getOldestPostDateTime(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .orderBy((post) => post.createdDateTime)
            .select((post) => new Date(post.createdDateTime))
            .defaultIfEmpty(new Date())
            .firstOrDefault();
    }
    private onRefresh() {
        this.props.actions.loadNewerPosts(1, this.getNewestPostDateTime());
        this.setState({ isRefreshing: true });
        setTimeout(() => this.setState({ isRefreshing: false }), 20000);
    }
    private _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: boolean) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: adjacentRowHighlighted ? "#3B5998" : "#CCCCCC",
                    height: adjacentRowHighlighted ? 4 : 1,
                }}
            />
        );
    }
    private getRefreshControl() {
        return <RefreshControl
            refreshing={!!this.state.isRefreshing || !!this.props.app.loading.posts}
            onRefresh={this.onRefresh}
            progressBackgroundColor="#ffff00"
        />;
    }
    private _onNavigatorEvent(event) {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "close") {
                this.props.navigator.dismissModal();
            }
        }
    }
    private _viewPost(postId) {
        this.props.navigator.push({
            screen: "app.PostDetail",
            passProps: {
                postId,
            },
            backButtonHidden: false,
            navigatorButtons: {
                rightButtons: [
                    {
                        id: "close",
                        title: "close",
                        // icon: iconsMap["ios-arrow-round-down"],
                    },
                ],
            },
        });
    }
}

function mapStateToProps(state: any, ownProps: any) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
        app: state.app,
        posts: state.entities.posts,
        users: state.entities.users,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        actions: bindActionCreators(appActions, dispatch),
    };
}

interface IPostListProps {
    actions: any;
    app: any;
    navigator: Navigator;
    posts: any[];
    users: any[];
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
