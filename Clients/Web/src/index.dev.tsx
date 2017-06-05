import classNames from "classnames/bind";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
// import DevTools from "./containers/DevTools";
import { Index } from "./index";
import configureStore from "./store/ConfigureStore.dev";

const store = configureStore({});
// const cx = classNames.bind(require("./devstyles.dev.scss"));

declare const module: any;

const renderApp = (Cmp) => ReactDOM.render(
    <AppContainer>
        <Cmp store={store} history={history}>
            {/*<div className={cx("devtools")}>
                <DevTools />
            </div>*/}
        </Cmp>
    </AppContainer>,
    document.getElementById("app")
);

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

renderApp(Index);

if (module.hot) {
    module.hot.accept("./index", () => {
        // const { NewIndex = Index } = require("./index");
        renderApp(Index);
    });
}
