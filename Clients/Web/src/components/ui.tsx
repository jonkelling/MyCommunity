import { RaisedButton as MUIRaisedButton } from "material-ui";
import React from "react";
import TextField from "./ui/TextField";

class RaisedButton extends React.Component<__MaterialUI.RaisedButtonProps, {}> {
    public render() {
        return <MUIRaisedButton {...this.props} />;
    }
}

export {
    RaisedButton,
    TextField
};
