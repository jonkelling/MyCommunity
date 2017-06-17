import React from "react";
import { connect } from "react-redux";
import { View } from "./ui";

class ActiveUser extends React.Component<IActiveUserProps, {}> {
    public render() {
        return <View>
            {this.props.firstName} {this.props.lastName}
        </View>;
    }
}

export default connect(mapStateToProps)(ActiveUser);

function mapStateToProps(state) {
    return {
        firstName: state.app.currentUser && state.app.currentUser.firstName,
        lastName: state.app.currentUser && state.app.currentUser.lastName,
        email: state.app.currentUser && state.app.currentUser.email
    };
}

interface IActiveUserProps {
    firstName: string;
    lastName: string;
    email: string;
}
