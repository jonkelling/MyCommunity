import { DropDownMenu, Menu, MenuItem, RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Fragment } from "redux-little-router";
import "./App.scss";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import ActiveUser from "./components/ActiveUser";
import EditPost from "./components/EditPost";
import MainAppBar from "./components/MainAppBar";
import PostList from "./components/PostList";
import ScrollableDialog from "./components/ScrollableDialog";
import { View } from "./components/ui";
import editsActions from "./editsActions";

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

        return <View>
            <MainAppBar actions={this.props.appActions} />
            <Fragment forRoute="/dashboard">
                <View>
                    <ActiveUser />
                    <RaisedButton
                        label="New Post"
                        onTouchTap={() => this.props.appActions.startNewPost(this.props.app.currentUser)} />
                    <EditPost
                        communityId={this.props.app.currentUser && this.props.app.currentUser.communityId}
                        post={selectedPost}
                        updateEdits={this.props.editsActions.updateEdits}
                        save={this.props.appActions.savePost}
                        cancel={() => {
                            this.props.appActions.push("/dashboard");
                            this.props.appActions.clearPosts();
                            this.props.loadOlderPosts(1, new Date());
                        }} />
                    {this.props.app.loading.posts && <div>Loading...</div>}
                    <PostList posts={this.props.entities.posts} />
                </View>
            </Fragment>
        </View>;
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
