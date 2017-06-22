import IPost from '../IPost';

import classNames from "classnames/bind";
import Enumerable from "linq";
import React from "react";
import { Link } from "redux-little-router";
const styles = require("./PostList.scss");

const cx = classNames.bind(styles);

export default class PostList extends React.Component<IPostListProps, any> {
    public render() {
        const Post = (post) => <div key={post.id}>
            <Link href={`/dashboard/post/${post.id}`}>{post.headline}</Link>
        </div>;

        const posts =
            this.props.posts &&
            Enumerable.from(Object.keys(this.props.posts))
                .select((postId) => this.props.posts[postId])
                .orderByDescending((post: IPost) => post.createdDateTime)
                .select(Post)
                .toArray();

        return <div className={cx("component")}>
            {posts}
        </div>;
    }
}

interface IPostListProps {
    posts: IPost[];
}
