import moment from "moment";
import React from "react";
import { Text } from "react-native";

export default (props) => {
    const dateInput = props.date || props.children;

    if (!dateInput) {
        return null;
    }

    const date = getDateFromInput(dateInput);

    if (!date) {
        return null;
    }

    // const dateString = getFormattedDateString(date);
    const dateString = moment(date).fromNow();

    return <Text style={props.style}>{dateString}</Text>;
};

function getDateFromInput(input) {
    let date: Date;
    if (typeof input === "string" || input === "number") {
        date = new Date(input);
    } else {
        date = input;
    }
    return date;
}

function getFormattedDateString(date: Date) {
    const now = new Date();
    let dateString = moment(date).format("MMM D");
    if (date.getFullYear() !== now.getFullYear()) {
        dateString += `, ${date.getFullYear()}`;
    }
    return dateString;
}
