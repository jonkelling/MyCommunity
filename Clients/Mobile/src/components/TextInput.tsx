import React from "react";
import { TextInput as RNTextInput, TextInputProperties } from "react-native";

export default class TextInput extends React.Component<any, {}> {
    public render() {
        return <RNTextInput {...this.props} />;
    }
}
