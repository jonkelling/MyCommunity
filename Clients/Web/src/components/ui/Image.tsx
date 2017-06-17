import React from "react";

export default class Image extends React.Component<React.HTMLProps<HTMLImageElement>, {}> {
    public render() {
        return <img {...this.props} />;
    }
}
