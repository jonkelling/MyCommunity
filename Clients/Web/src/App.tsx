import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Fragment } from "redux-little-router";
import "./App.scss";
import appActions from "./appActions";
import leftData from "./leftData";
import PlanDetails from "./PlanDetails";
import rightData from "./rightData";
import RightSide from "./RightSide";

class App extends React.Component<any, { selectedApprovedPlanID: number }> {
    constructor(props) {
        super(props);
        this.state = {
            selectedApprovedPlanID: null
        };
    }
    public render() {
        const data = rightData.treeListCollection[0].provisionDetails
            .filter((details) => {
                return details.approvedPlanId === this.state.selectedApprovedPlanID;
                // return details.approvedPlanId === parseInt(this.props.router.params.approvedPlanID, undefined);
            })[0];

        return <div>
            <table>
                <tr>
                    <td style={{ verticalAlign: "top" }}>
                        <Fragment forRoute="/soda">
                            <div>Stuff</div>
                        </Fragment>
                        <div>
                            <table>
                                {leftData.treeListCollection.map((x, i) =>
                                    <tr>
                                        <td>
                                            <div>{x.planCategory}</div>
                                            <table>
                                                {x.planDetails.map((y, i2) => <PlanDetails
                                                    key={i2} {...y}
                                                    goto={(z) => this.setState({ selectedApprovedPlanID: z })} />)}
                                            </table>
                                        </td>
                                    </tr>)
                                }
                            </table>
                        </div>
                    </td>
                    <Fragment forRoute="/rightData/:approvedPlanID">
                        <td style={{ verticalAlign: "top" }}>
                            <div>
                                {rightData.treeListCollection.map((x) =>
                                    <RightSide text={x.provisionCategory} moreData={x.provisionDetails} />
                                )}
                            </div>
                        </td>
                    </Fragment>
                </tr></table>
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        app: state.app,
        data: state.data,
        router: state.router,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
