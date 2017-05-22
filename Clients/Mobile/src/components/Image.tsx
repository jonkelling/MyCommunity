import React from "react";
import { Image as RNImage, ImageProperties } from "react-native";

export default class Image extends React.Component<any, {}> {
    public render() {
        return <RNImage {...this.props} />;
    }
}
