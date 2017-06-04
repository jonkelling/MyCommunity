import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { combineReducers } from "redux";
import { Index } from "./index";
import configureStore from "./store/ConfigureStore.dev";

const store = configureStore({});

declare const module: any;

const renderApp = (renderProps) => ReactDOM.render(
    <AppContainer>
        <Index store={store} history={history} />
    </AppContainer>,
    document.getElementById("app")
);

renderApp({});

if (module.hot) {
    module.hot.accept(() => {
        ReactDOM.render(
            <AppContainer>
                <Index store={store} history={history} />
            </AppContainer>,
            document.getElementById("app")
        );
    });
}
