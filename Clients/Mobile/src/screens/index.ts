import { Navigation } from "react-native-navigation";

// import Drawer from "./Drawer";
import AppContentContainer from "../AppContentContainer";
import NoCommunityAssigned from "../components/NoCommunityAssigned";
import PostDetail from "../components/posts/PostDetail";
import LoadingScreen from "../LoadingScreen";

export function registerScreens(store, Provider) {
    Navigation.registerComponent(ScreenId.Home, () => AppContentContainer, store, Provider);
    Navigation.registerComponent(ScreenId.Loading, () => LoadingScreen, store, Provider);
    Navigation.registerComponent(ScreenId.NoCommunityAssigned, () => NoCommunityAssigned, store, Provider);
    Navigation.registerComponent(ScreenId.PostDetail, () => PostDetail, store, Provider);
    // Navigation.registerComponent("movieapp.Drawer", () => Drawer);
}

export const ScreenId = {
    Home: "app.Home",
    Loading: "app.Loading",
    NoCommunityAssigned: "app.NoCommunityAssigned",
    PostDetail: "app.PostDetail",
};
