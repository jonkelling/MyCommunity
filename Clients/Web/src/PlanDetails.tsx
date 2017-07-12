import classNames from "classnames/bind";
import moment from "moment";
import React from "react";
import { Link } from "redux-little-router";

const cx = classNames.bind(require("./PlanDetails.scss"));

export default class PlanDetails extends React.Component<IPlanDetails, {}> {
    constructor(props: IPlanDetails) {
        super(props);
        this.state = {};
        this.goClick = this.goClick.bind(this);
    }

    public render() {
        return <tr className={cx("component")}>
            <td>
                <Link href={`/rightData/${this.props.approvedPlanID}`}>
                    {this.props.planName}
                </Link>
                <button type="button" onClick={this.goClick}>Go</button>
            </td>
            <td>
                {moment(new Date(this.props.effectiveDate)).fromNow()}
            </td>
        </tr>;
    }

    private goClick() {
        this.props.goto(this.props.approvedPlanID);
    }
}

interface IPlanDetails {
    approvedPlanID: number;
    effectiveDate: string;
    planName: string;
    goto: (approvedPlanID: number) => void;
}
