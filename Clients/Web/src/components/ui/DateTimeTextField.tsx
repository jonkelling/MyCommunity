import moment from "moment";
import React from "react";
import { TextField } from "../ui";

interface IDateTimeTextField {
    value: Date | string;
}

export default class DateTimeTextField extends React.Component<__MaterialUI.TextFieldProps & IDateTimeTextField, {}> {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    public render() {
        const value = this.props.value && moment(`${this.props.value}`).format("YYYY-MM-DDTHH:mm");
        return <TextField {...this.props} type="datetime-local" value={value || ""} onChange={this.onChange} />;
    }
    private onChange(event, date) {
        if (!this.props.onChange) {
            return;
        }
        const d = moment(date);
        this.props.onChange(event, moment(date).toISOString());
    }
}
