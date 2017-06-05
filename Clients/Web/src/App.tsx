import React from "react";
import { connect } from "react-redux";
import appActions from "./appActions";
import AuthService from "./auth/AuthService";

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
    public render() {
        handleAuthentication(window);
        return <div>
            <input type="text" value={this.state.headline} onChange={this.updateHeadline} />
            <textarea cols={30} rows={10} onChange={this.updateContent} value={this.state.content} />
            <input type="button" value="Submit" onClick={this.createPost} />
            fdsaasdfasdf
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
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (data) => dispatch(appActions.createPost(1, data.headline, data.content)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
