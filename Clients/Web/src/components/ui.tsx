import { RaisedButton as MUIRaisedButton } from "material-ui";
import React from "react";
import FlatButton from "./ui/FlatButton";
import LinkButton from "./ui/LinkButton";
import Text from "./ui/Text";
import TextField from "./ui/TextField";
import View from "./ui/View";

class RaisedButton extends React.Component<__MaterialUI.RaisedButtonProps, {}> {
    public render() {
        return <MUIRaisedButton {...this.props} />;
    }
}

export {
    FlatButton,
    LinkButton,
    RaisedButton,
    Text,
    TextField,
    View,
};
