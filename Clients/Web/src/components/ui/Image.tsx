import classNames from "classnames/bind";
import omit from "lodash.omit";
import React from "react";

const cx = classNames.bind(require("./Image.scss"));

export default class Image extends React.Component<IImageProps | IDivProps, {}> {
    public render() {
        if (this.props.cover || this.props.contain) {
            return this.renderAsBackgroundImage();
        }
        const imgProps = omit(this.props, ["cover", "contain"]);
        return <img {...imgProps} />;
    }

    private renderAsBackgroundImage() {
        const backgroundSize = (
            (this.props.cover && "cover") ||
            (this.props.contain && "contain")
        );
        const divProps = omit(this.props, ["cover", "contain"]);
        return <div
            {...divProps}
            className={
                `${this.props.className} ${
                    cx(["div-with-background-image",
                        { cover: this.props.cover },
                        { contain: this.props.contain }])
                    }`.trim()
            }
            style={{
                ...this.props.style,
                backgroundImage: `url(${this.props.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize,
            }}
        />;
    }
}

interface IComponentProps {
    cover?: boolean;
    contain?: boolean;
}

interface IImageProps extends IComponentProps, React.HTMLProps<HTMLImageElement> {
}

interface IDivProps extends IComponentProps, React.HTMLProps<HTMLDivElement> {
}
