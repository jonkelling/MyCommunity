import React from "react";
import { connect } from "react-redux";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";
import PostList from "./components/PostList";

function handleAuthentication(nextState) {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        AuthService.handleAuthentication();
    }
}

class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            headline: "",
            content: "",
        };
        this.createPost = this.createPost.bind(this);
        this.updateHeadline = this.updateHeadline.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }
    public componentWillMount() {
        this.props.loadOlderPosts(1, new Date());
    }
    public render() {
        handleAuthentication(window);
        return <div>
            <input type="text" value={this.state.headline} onChange={this.updateHeadline} />
            <textarea cols={30} rows={10} onChange={this.updateContent} value={this.state.content} />
            <input type="button" value="Submit" onClick={this.createPost} />
            <PostList posts={this.props.entities.posts} />
        </div>;
    }
    private createPost(event) {
        this.props.createPost({ headline: this.state.headline, content: this.state.content });
    }
    private updateHeadline(event) {
        this.setState({ headline: event.target.value });
    }
    private updateContent(event) {
        this.setState({ content: event.target.value });
    }
}

const mapStateToProps = (state) => {
    return {
        entities: state.entities,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (data) => dispatch(appActions.createPost(1, data.headline, data.content)),
        loadOlderPosts: (communityId: number, beforeDateTime: Date, limit: number = null) =>
            dispatch(appActions.loadOlderPosts(communityId, beforeDateTime, limit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
