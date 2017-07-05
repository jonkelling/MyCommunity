import isEqual from "lodash.isequal";
import React from "react";
import {
    Button,
    Image, InteractionManager, ListView, ListViewDataSource, RefreshControl, StyleSheet,
    Text,
    TextStyle,
    View,
} from "react-native";
import { Navigator } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../../../node_modules/linq/linq";
import appActions from "../../appActions";
import Post from "./Post";
import Spinner from "../Spinner";
const stringify = require("json-stringify-safe");

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    scrollview: {
        flex: 1,
    },
    headline: {
        fontWeight: "500",
        flex: 1,
        alignSelf: "flex-start",
        fontSize: 15,
    },
    content: {
        alignSelf: "auto",
        color: "gray",
        fontSize: 14,
    }
});

const bottomOfListLoadingIndicator = <View style={{
    alignItems: "center",
    alignContent: "center",
    padding: 20,
}}>
    <Spinner />
</View>;

class PostList extends React.Component<IPostListProps, { postsDataSource: ListViewDataSource, isRefreshing: boolean }> {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isRefreshing: false,
            postsDataSource: ds.cloneWithRows(this.getSortedPostsArray()),
        };
        this.viewPost = this.viewPost.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    public componentWillReceiveProps(nextProps: IPostListProps) {
        const sortedPosts = this.getSortedPostsArray(nextProps);
        this.setState({
            postsDataSource: this.state.postsDataSource.cloneWithRows([
                ...sortedPosts,
                !this.state.isRefreshing && nextProps.app.loading.posts && bottomOfListLoadingIndicator
            ].filter(x => x))
        });
        if (this.props.app.loading.posts && !nextProps.app.loading.posts) {
            this.setState({ isRefreshing: false });
        }
    }
    public render() {
        return (
            <ListView dataSource={this.state.postsDataSource}
                enableEmptySections
                renderRow={(rowData) => {
                    return rowData === bottomOfListLoadingIndicator
                        ? rowData
                        : <Post post={rowData}
                            author={this.props.users[rowData.author]}
                            style={styles.row}
                            headlineStyle={styles.headline}
                            contentStyle={styles.content}
                            viewPost={this.viewPost} />
                }}
                renderSeparator={this.renderSeparator}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={1.0}
                refreshControl={this.getRefreshControl()}
                style={styles.scrollview} />
        );
    }
    private *getRowsFromDataSource(ds: ListViewDataSource) {
        for (let i = 0; i < ds.getRowCount(); i++) {
            yield ds.getRowData(0, i);
        }
    }
    private onEndReached() {
        console.log("onEndReached");
        if (this.props.app.resultCount.loadOlderPosts === 0 ||
            this.props.app.loading.posts) {
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            this.props.actions.loadOlderPosts(
                this.props.app.currentUser.communityId,
                this.getOldestPostDateTime(), 5);
        });
    }
    private getSortedPostsArray(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .where((post) => props.users[post.author] && props.users[post.author].communityId === props.app.currentUser.communityId)
            .where((post) => !post.expireDateTime || new Date(post.expireDateTime) > new Date())
            .orderByDescending((post) => post.createdDateTime)
            .toArray();
    }
    private getNewestPostDateTime(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .where((post) => props.users[post.author] && props.users[post.author].communityId === props.app.currentUser.communityId)
            .where((post) => !post.expireDateTime || new Date(post.expireDateTime) > new Date())
            .orderByDescending((post) => post.createdDateTime)
            .select((post) => new Date(post.createdDateTime))
            .defaultIfEmpty(new Date())
            .firstOrDefault();
    }
    private getOldestPostDateTime(props = this.props) {
        return Enumerable.from(props.posts)
            .select((x) => x.value)
            .where((post) => props.users[post.author] && props.users[post.author].communityId === props.app.currentUser.communityId)
            .where((post) => !post.expireDateTime || new Date(post.expireDateTime) > new Date())
            .orderBy((post) => post.createdDateTime)
            .select((post) => new Date(post.createdDateTime))
            .defaultIfEmpty(new Date())
            .firstOrDefault();
    }
    private onRefresh() {
        // console.log(`Newest post date/time: ${this.getNewestPostDateTime()}`);
        // console.log(JSON.stringify(this.props.app));
        this.props.actions.clearPosts();
        this.props.actions.loadOlderPosts(this.props.app.currentUser.communityId, new Date(), 6);
        // this.props.actions.loadExpiredPosts(this.props.app.currentUser.communityId);
        // this.setState({ isRefreshing: true });
    }
    private renderSeparator(sectionID: string, rowID: number, adjacentRowHighlighted: boolean) {
        const sectionIndex = 0;
        if (!this.state.postsDataSource || this.state.postsDataSource.getRowAndSectionCount() === 0) {
            return null;
        }
        if (this.state.postsDataSource.getRowData(sectionIndex, rowID) === bottomOfListLoadingIndicator) {
            return null;
        }
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: adjacentRowHighlighted ? "#3B5998" : "#F6F6F6",
                    height: adjacentRowHighlighted ? 4 : 1,
                }}
            />
        );
    }
    private getRefreshControl() {
        return <RefreshControl
            refreshing={!!this.state.isRefreshing}
            onRefresh={this.onRefresh}
            progressBackgroundColor="#ffff00"
        />;
    }
    private onNavigatorEvent(event) {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "close") {
                this.props.navigator.dismissModal();
            }
        }
    }
    private viewPost(postId) {
        this.props.navigator.push({
            screen: "app.PostDetail",
            passProps: {
                postId,
            },
            backButtonHidden: false,
            navigatorButtons: {
                // rightButtons: [
                //     {
                //         id: "close",
                //         title: "close",
                //         // icon: iconsMap["ios-arrow-round-down"],
                //     },
                // ],
            },
        });
    }
}

function mapStateToProps(state: any, ownProps: any) {
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
