import omit from "lodash.omit";
import { IconButton, IconMenu, MenuItem } from "material-ui";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import React from "react";

export default class AppBarMemberMenu extends React.Component<{ logout: () => any }, {}> {
    public static muiName = "IconMenu";
    public render() {
        return <IconMenu
            {...omit(this.props, ["logout"]) }
            iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }} >
            <MenuItem primaryText="Refresh" disabled />
            <MenuItem primaryText="Help" disabled />
            <MenuItem primaryText="Sign out" onTouchTap={this.props.logout} />
        </IconMenu>;
    }
}
