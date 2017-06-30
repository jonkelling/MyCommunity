import React from "react";
import {
    // TextInput as RNTextInput,
    TextInputProperties,
    ViewProperties
} from "react-native";
// tslint:disable-next-line:no-var-requires
const Shoutem = require("@shoutem/ui");

export default class TextInput extends React.Component<TextInputProperties, {}> {
    public render() {
        return <Shoutem.TextInput {...(this.props as any)} />;
    }
}
