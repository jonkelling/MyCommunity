import classNames from "classnames/bind";
import { DropDownMenu, Menu, MenuItem, RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Fragment } from "redux-little-router";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import ActiveUser from "./components/ActiveUser";
import EditPost from "./components/EditPost";
import MainAppBar from "./components/MainAppBar";
import MarketingMaterial from "./components/MarketingMaterial/MarketingMaterial";
import PostList from "./components/PostList";
import ScrollableDialog from "./components/ScrollableDialog";
import { View } from "./components/ui";
import editsActions from "./editsActions";
import { responsive } from "./Responsive";

const cx = classNames.bind(require("./App.scss"));

class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selectedPostId: null
        };
        this.createPost = this.createPost.bind(this);
    }
    public render() {
        const selectedPost = this.props.edits.post;

        return responsive((flags) => {
            const responsiveClassNames = Object.keys(flags).map((key) => ({ [cx(key)]: flags[key] }));
            return <View className={cx("AntdApp")}>
                <View className={classNames(cx("app-bar"), responsiveClassNames)}>
                    <MainAppBar actions={this.props.appActions} />
                </View>
                <Fragment forRoute="/dashboard">
                    <View className={classNames(cx("content"), responsiveClassNames)}>
                        {/* <ActiveUser /> */}
                        <Fragment forRoute="/posts">
                            <View>
                                <RaisedButton
                                    label="New Post"
                                    onTouchTap={() => this.props.appActions.startNewPost(this.props.app.currentUser)} />
                                <EditPost
                                    communityId={this.props.app.currentUser && this.props.app.currentUser.communityId}
                                    post={selectedPost}
                                    updateEdits={this.props.editsActions.updateEdits}
                                    save={this.props.appActions.savePost}
                                    cancel={() => {
                                        this.props.appActions.push("/dashboard/posts");
                                        this.props.appActions.clearPosts();
                                        this.props.loadOlderPosts(1, new Date());
                                    }} />
                                {this.props.app.loading.posts && <div>Loading...</div>}
                                <PostList posts={this.props.entities.posts} />
                            </View>
                        </Fragment>
                        <Fragment forRoute="/marketingMaterial">
                            <MarketingMaterial />
                        </Fragment>
                    </View>
                </Fragment>
            </View >;
        });
    }
    private createPost(event) {
        this.props.createPost({ headline: this.state.headline, content: this.state.content });
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app,
        entities: state.entities,
        edits: state.edits,
        router: state.router,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (data) => dispatch(appActions.createPost(1, data.headline, data.content)),
        loadOlderPosts: (communityId: number, beforeDateTime: Date, limit: number = null) =>
            dispatch(appActions.loadOlderPosts(communityId, beforeDateTime, limit)),
        appActions: bindActionCreators(appActions, dispatch),
        editsActions: bindActionCreators(editsActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
