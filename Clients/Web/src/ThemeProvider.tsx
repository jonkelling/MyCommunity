import React from "react";
import { Provider } from "react-redux";
import Redux from "redux";

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { cyan500, white } from "material-ui/styles/colors";

const muiTheme = getMuiTheme({
    palette: {
        // textColor: cyan500,
    },
    appBar: {
    },
    // appBarFlatButton: {
    //     textColor: white
    // }
});

export default class ThemeProvider extends React.Component<{}, {}> {
    public render() {
        return <MuiThemeProvider muiTheme={muiTheme}>
            {this.props.children}
        </MuiThemeProvider>;
    }
}
