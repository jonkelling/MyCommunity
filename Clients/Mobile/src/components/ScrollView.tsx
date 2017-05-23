import React from "react";
// import { ScrollView as RNScrollView } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export default class ScrollView extends React.Component<any, {}> {
    public render() {
        return <Shoutem.ScrollView {...this.props} />;
    }
}
