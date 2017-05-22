import React from "react";
import Navigation from "react-native-navigation";
import { connect, Provider } from "react-redux";

// import Drawer from "./Drawer";
import AppContentContainer from "../AppContentContainer";
import NoCommunityAssigned from "../components/NoCommunityAssigned";
import PostDetail from "../components/posts/PostDetail";
import LoadingScreen from "../LoadingScreen";

function wrapComponent(Cmp, store) {
    return <Provider store={store}><Cmp /></Provider>;
}

export function registerScreens(store, Provider) {
    Navigation.registerContainer(ScreenId.Home, () => wrapComponent(AppContentContainer, store));
    Navigation.registerContainer(ScreenId.Loading, () => wrapComponent(LoadingScreen, store));
    Navigation.registerContainer(ScreenId.NoCommunityAssigned, () => wrapComponent(NoCommunityAssigned, store));
    Navigation.registerContainer(ScreenId.PostDetail, () => wrapComponent(PostDetail, store));
    // Navigation.registerComponent("movieapp.Drawer", () => Drawer);
}

export const ScreenId = {
    Home: "app.Home",
    Loading: "app.Loading",
    NoCommunityAssigned: "app.NoCommunityAssigned",
    PostDetail: "app.PostDetail",
};
