import React from "react";
import { ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export default class GridRow extends React.Component<any, {}> {
    public render() {
        return <Shoutem.GridRow {...this.props} />;
    }
    public static groupByRows(a, b, c) {
        return Shoutem.GridRow.groupByRows(a, b, c);
    }
}
