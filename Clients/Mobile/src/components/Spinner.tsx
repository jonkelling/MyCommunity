import React from "react";
import { ActivityIndicator, ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export interface ISpinnerPropertiesWrapper {
    color?: string;
    size?: string;
    styleName?: string;
};

export default class Spinner extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }
    public render() {
        return <ActivityIndicator />;
    }
}
