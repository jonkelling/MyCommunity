import React from "react";
import { ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export default class Tile extends React.Component<any, {}> {
    public render() {
        return <Shoutem.Tile {...this.props} />;
    }
}
