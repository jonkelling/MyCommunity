import { FlatButton as MUIFlatButton } from "material-ui";
import React from "react";

export default class FlatButton extends React.Component<__MaterialUI.FlatButtonProps, {}> {
    public render() {
        return <MUIFlatButton {...this.props} />;
    }
}
