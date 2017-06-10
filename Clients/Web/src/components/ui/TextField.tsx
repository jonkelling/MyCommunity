import { TextField as MUITextField } from "material-ui";
import React from "react";

export default class TextField extends React.Component<__MaterialUI.TextFieldProps, {}> {
    public render() {
        return <MUITextField {...this.props} />;
    }
}
