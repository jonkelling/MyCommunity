import React from "react";
import { Provider } from "react-redux";
import Redux from "redux";

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "./App";
import ThemeProvider from "./ThemeProvider";

import moment from "moment";

import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";

const { Fragment, RouterProvider } = require("redux-little-router");

export class Index extends React.Component<{ store: Redux.Store<any>, history: any }, {}> {
    constructor(props) {
        super(props);
    }
    public render() {
        return <ThemeProvider>
            <Provider store={this.props.store}>
                <Fragment forRoute="/">
                    <LocaleProvider locale={enUS}>
                        <div>
                            {this.props.children}
                            <App />
                        </div>
                    </LocaleProvider>
                </Fragment>
            </Provider>
        </ThemeProvider>;
    }
}
