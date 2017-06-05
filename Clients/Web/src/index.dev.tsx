import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { Index } from "./index";
import configureStore from "./store/ConfigureStore.dev";

const store = configureStore({});

declare const module: any;

const renderApp = (Cmp) => ReactDOM.render(
    <AppContainer>
        <Cmp store={store} history={history} />
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
