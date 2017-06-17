import React from "react";

export default class View extends React.Component<React.HTMLProps<HTMLDivElement>, {}> {
    public render() {
        return <div {...this.props} />;
    }
}
