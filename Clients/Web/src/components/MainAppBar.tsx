import omit from "lodash.omit";
import {
    AppBar,
    IconButton,
    IconMenu,
    MenuItem,
    Toggle,
} from "material-ui";
import { white } from "material-ui/styles/colors";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import React from "react";
import { connect } from "react-redux";
import AppBarMemberMenu from "./AppBarMemberMenu";
import { FlatButton, View } from "./ui";

class MainAppBar extends React.Component<{
    actions: { login: () => void, logout: () => void },
    logged: boolean
}, {}> {
    public render() {
        const Login: any = (props) => {
            return (
                <FlatButton {...omit(this.props, ["actions", "logged", "dispatch"]) }
                    label="Login" style={{ color: white }}
                    onTouchTap={this.props.actions.login} />
            );
        };
        Login.muiName = "FlatButton";

        return (
            <View>
                <AppBar
                    title={"My Community"}
                    iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                    iconElementRight={this.props.logged
                        ? <AppBarMemberMenu logout={this.props.actions.logout} />
                        : <Login />}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged: state.app.currentUser
    };
}

export default connect(mapStateToProps)(MainAppBar);
