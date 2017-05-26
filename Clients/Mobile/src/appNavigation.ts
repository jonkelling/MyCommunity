
import { Navigation, NavigatorStyle } from "react-native-navigation";
import * as actions from "./actions/index";
import { ScreenId } from "./screens/index";

const navigatorStyle: NavigatorStyle = {
    navBarHideOnScroll: false,
    navBarTranslucent: true,
    drawUnderNavBar: false,
    navBarTextColor: "black",
    navBarButtonColor: "black",
    statusBarTextColorScheme: "dark",
    drawUnderTabBar: false,
};

const backToApp = () => {
    Navigation.dismissAllModals();
    return {
        type: actions.SET_SCREEN,
        payload: ScreenId.Home,
    };
};

const startApp = () => {
    console.log("====================================");
    console.log("  startApp");
    console.log("====================================");
    Navigation.startTabBasedApp({
        tabs: [
            {
                label: "Home",
                screen: "app.Home",
                // icon: iconsMap["ios-film-outline"],
                // selectedIcon: iconsMap["ios-film"],
                title: "Home",
                navigatorStyle,
                navigatorButtons: {
                    rightButtons: [
                        // {
                        //     title: "Search",
                        //     id: "search",
                        //     // icon: iconsMap["ios-search"],
                        // },
                    ],
                },
            },
        ],
        tabsStyle: {
            tabBarButtonColor: "white",
            tabBarSelectedButtonColor: "white",
            tabBarBackgroundColor: "white",
        },
    });
    return {
        type: actions.SET_SCREEN,
        payload: ScreenId.Home,
    };
};

const startNoCommunityAssigned = () => {
    console.log("====================================");
    console.log("  startNoCommunityAssigned");
    console.log("====================================");
    Navigation.showModal({
        screen: ScreenId.NoCommunityAssigned,
        title: "Welcome!",
        navigatorStyle: {
            navBarHidden: true,
            statusBarHidden: true,
        },
    });
    return {
        type: actions.SET_SCREEN,
        payload: ScreenId.NoCommunityAssigned,
    };
};

const startLoadingScreen = () => {
    console.log("====================================");
    console.log("  startLoadingScreen");
    console.log("====================================");
    Navigation.showModal({
        screen: ScreenId.Loading,
        title: "Welcome!",
        navigatorStyle: {
            navBarHidden: true,
            statusBarHidden: true,
        },
    });
    return {
        type: actions.SET_SCREEN,
        payload: ScreenId.Loading,
    };
};

const appNavigation = {
    backToApp,
    startLoadingScreen,
    startNoCommunityAssigned,
    startApp,
};

export default appNavigation;
