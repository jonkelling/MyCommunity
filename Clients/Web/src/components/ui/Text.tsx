import omit from "lodash.omit";
import React from "react";

export default class Text extends React.Component<ITextProps, {}> {
    public render() {
        const spanProps = omit(this.props, ["noselect", "defaultCursor"]);
        return <span
            {...spanProps}
            style={{
                ...this.props.style,
                ...(this.props.defaultCursor && { cursor: "default" })
            }}
        />;
    }
}

interface ITextProps extends React.HTMLProps<HTMLSpanElement> {
    noselect?: boolean;
    defaultCursor?: boolean;
}
