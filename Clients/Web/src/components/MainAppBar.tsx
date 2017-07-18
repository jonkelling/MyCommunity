import omit from "lodash.omit";
import {
    AppBar,
    Drawer,
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
import { bindActionCreators } from "redux";
import appActions from "../appActions";
import { drawerWidth } from "../appSettings";
import { responsive } from "../Responsive";
import AppBarMemberMenu from "./AppBarMemberMenu";
import { FlatButton, View } from "./ui";

class MainAppBar extends React.Component<{
    actions: { login: () => void, logout: () => void },
    push: (path: string) => any,
    logged: boolean
}, {
        drawerOpen: boolean
    }> {
    public ResponsiveDrawer: any;
    constructor(props) {
        super(props);
        this.state = { drawerOpen: false };
        this.appBarIconButtonTouchTap = this.appBarIconButtonTouchTap.bind(this);

        this.ResponsiveDrawer = responsive<__MaterialUI.DrawerProps>({
            base: <Drawer width={drawerWidth} />,
            desktop: () => ({ open: true }),
            tablet: () => ({ open: true }),
            mobile: () => ({
                open: this.state.drawerOpen,
                docked: false,
                onRequestChange: (open) => this.setState({ drawerOpen: open }),
            })
        });
    }
    public render() {
        const Login: any = (props) => {
            return (
                <FlatButton {...omit(this.props, ["actions", "logged", "dispatch"]) }
                    label="Login" style={{ color: white }}
                    onTouchTap={this.props.actions.login} />
            );
        };
        Login.muiName = "FlatButton";

        const title = "My Community";

        // iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        return <View>
            {responsive((flags) => <AppBar
                title={flags.mobile && title}
                showMenuIconButton={flags.mobile}
                onLeftIconButtonTouchTap={this.appBarIconButtonTouchTap}
                iconElementRight={this.props.logged
                    ? <AppBarMemberMenu logout={this.props.actions.logout} />
                    : <Login />}
            />)}
            <this.ResponsiveDrawer>
                <AppBar
                    title={title}
                    showMenuIconButton={false}
                />
                <MenuItem onTouchTap={this.push("/dashboard/posts")}>
                    Posts
                </MenuItem>
                <MenuItem onTouchTap={this.push("/dashboard/marketingMaterials")}>
                    Marketing Materials
                </MenuItem>
            </this.ResponsiveDrawer>
        </View>;
    }
    private appBarIconButtonTouchTap() {
        this.setState({ drawerOpen: true });
    }
    private push(path: string) {
        return () => this.props.push(path);
    }
}

function mapStateToProps(state) {
    return {
        logged: state.app.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return {
        push: bindActionCreators(appActions.push, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainAppBar);
