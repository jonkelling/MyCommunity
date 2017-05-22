import React from "react";
import { ImageProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export default class Image extends React.Component<any, {}> {
    public render() {
        return <Shoutem.Image {...this.props} />;
    }
}
