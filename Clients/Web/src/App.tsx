import { RaisedButton } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import EditPost from "./components/EditPost";
import PostList from "./components/PostList";
import ScrollableDialog from "./components/ScrollableDialog";
import editsActions from "./editsActions";

function handleAuthentication(nextState) {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        AuthService.handleAuthentication();
    }
}

class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selectedPostId: null
        };
        this.createPost = this.createPost.bind(this);
        this.selectPost = this.selectPost.bind(this);
    }
    public componentWillMount() {
        this.props.loadOlderPosts(1, new Date());
    }
    public render() {
        handleAuthentication(window);

        const selectedPost =
            this.state.selectedPostId &&
            this.props.edits.post;

        return <MuiThemeProvider>
            <div>
                <RaisedButton label="Logout" onTouchTap={this.props.appActions.logout} /><br /><br />
                <EditPost
                    post={selectedPost}
                    updateEdits={this.props.editsActions.updateEdits}
                    save={this.props.appActions.savePost}
                    cancel={() => {
                        this.props.editsActions.clearEdits("post");
                        this.props.loadOlderPosts(1, new Date());
                    }} />
                <PostList posts={this.props.entities.posts} selectPost={this.selectPost} />
            </div>
        </MuiThemeProvider>;
    }
    private createPost(event) {
        this.props.createPost({ headline: this.state.headline, content: this.state.content });
    }
    private selectPost(postId) {
        this.setState({ selectedPostId: postId });
        this.props.editsActions.updateEdits(
            "post",
            this.props.entities.posts[postId]);
    }
}

const mapStateToProps = (state) => {
    return {
        entities: state.entities,
        edits: state.edits,
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
