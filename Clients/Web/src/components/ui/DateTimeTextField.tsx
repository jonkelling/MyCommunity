import { DatePicker, TimePicker } from "antd";
import { DatePickerProps } from "antd/lib/date-picker";
import Enumerable from "linq";
import moment from "moment";
import React from "react";
import { TextField } from "../ui";

interface IDateTimeTextField {
    value: string;
    onChange: (date: string) => void;
}

export default class DateTimeTextField extends React.Component<IDateTimeTextField, {}> {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    public render() {
        return <div>
            <div>
                <label style={{ paddingRight: 8 }}>
                    Expiration Date/Time:
                </label>
                <DatePicker
                    onChange={this.onChange}
                    value={(this.props.value && moment(this.props.value)) || null}
                    format="YYYY-MM-DD   h:mm a"
                    showToday={true}
                    showTime={{
                        disabledSeconds: () => Enumerable.range(0, 60).toArray(),
                        disabledMinutes: () => Enumerable.range(0, 60).except([0, 15, 30, 45]).toArray(),
                        use12Hours: true,
                        hideDisabledOptions: true,
                        defaultValue: moment("08:00 PM", "hh:mm a")
                    }}
                    style={{ marginRight: 8 }}
                />
            </div>
        </div>;
    }
    private onChange(date: moment.Moment, dateString: string) {
        if (!this.props.onChange) {
            return;
        }
        this.props.onChange(date && date.toISOString());
    }
}
