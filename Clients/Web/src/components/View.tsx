import React from "react";

export default class View extends React.Component<{}, {}> {
    public render() {
        return <div {...this.props} />;
    }
}
