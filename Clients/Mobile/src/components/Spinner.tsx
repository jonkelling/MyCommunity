import React from "react";
import { ViewProperties } from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export interface ISpinnerPropertiesWrapper {
    color?: string;
    size?: string;
    styleName?: string;
}

const Spinner = (props: ISpinnerPropertiesWrapper) => <Shoutem.Spinner {...this.props} />;

export default Spinner;
