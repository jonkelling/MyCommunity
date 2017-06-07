import classNames from "classnames/bind";
import React from "react";
const styles = require("./PostList.scss");

const cx = classNames.bind(styles);

const Post = (post) => <div key={post.id}>
    <a href={`/post/${post.id}`}>{post.headline}</a>
</div>;

export default class PostList extends React.Component<any, any> {
    public render() {
        return <div className={cx("component")}>
            {this.props.posts && Object.keys(this.props.posts).map((postId) => {
                return Post(this.props.posts[postId]);
            })}
        </div>;
    }
}
