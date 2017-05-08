import { Navigation } from "react-native-navigation";

// import Drawer from "./Drawer";
import AppContentContainer from "../AppContentContainer";
import PostDetail from "../components/posts/PostDetail";

export function registerScreens(store, Provider) {
    Navigation.registerComponent("app.PostList", () => AppContentContainer, store, Provider);
    Navigation.registerComponent("app.PostDetail", () => PostDetail, store, Provider);
    // Navigation.registerComponent("movieapp.Drawer", () => Drawer);
}
