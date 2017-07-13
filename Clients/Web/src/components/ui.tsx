import { RaisedButton as MUIRaisedButton } from "material-ui";
import React from "react";
import DateTimeTextField from "./ui/DateTimeTextField";
import FlatButton from "./ui/FlatButton";
import FormattedDateText from "./ui/FormattedDateText";
import Image from "./ui/Image";
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
    DateTimeTextField,
    FlatButton,
    FormattedDateText,
    Image,
    LinkButton,
    RaisedButton,
    Text,
    TextField,
    View,
};
