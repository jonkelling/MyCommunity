import React from "react";

export default class Text extends React.Component<ITextProps, {}> {
    public render() {
        return <span
            {...this.props}
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
