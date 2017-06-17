import React from "react";

export default class LinkButton extends React.Component<React.HTMLProps<HTMLAnchorElement>, {}> {
    public render() {
        return <a
            href="javascript:;"
            {...this.props}
        />;
    }
}
