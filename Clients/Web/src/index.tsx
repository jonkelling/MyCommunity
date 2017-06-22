import React from "react";
import { Provider } from "react-redux";
import Redux from "redux";

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "./App";
import ThemeProvider from "./ThemeProvider";

const { Fragment, RouterProvider } = require("redux-little-router");

export class Index extends React.Component<{ store: Redux.Store<any>, history: any }, {}> {
    public render() {
        return <ThemeProvider>
            <Provider store={this.props.store}>
                <RouterProvider store={this.props.store}>
                    <Fragment forRoute="/">
                        <div>
                            {this.props.children}
                            <App />
                        </div>
                    </Fragment>
                </RouterProvider>
            </Provider>
        </ThemeProvider>;
    }
}
