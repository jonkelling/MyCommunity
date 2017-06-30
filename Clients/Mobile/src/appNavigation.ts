
import { Navigation, NavigatorStyle } from "react-native-navigation";
import * as actions from "./actions/index";
import colors from "./colors";
import { ScreenId } from "./screens/index";
import { iconsMap } from "./utils/AppIcons";

const navigatorStyle: NavigatorStyle = {
    navBarHideOnScroll: false,
    navBarTranslucent: true,
    drawUnderNavBar: false,
    navBarTextColor: "black",
    navBarButtonColor: colors.blue,
    statusBarTextColorScheme: "dark",
    drawUnderTabBar: true,
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
                icon: iconsMap["home"],
                selectedIcon: iconsMap["home"],
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
            {
                label: "Feedback",
                screen: "app.Feedback",
                icon: iconsMap["feedback"],
                selectedIcon: iconsMap["feedback"],
                title: "Feedback",
                navigatorStyle,
                navigatorButtons: {
                    rightButtons: [
                        {
                            title: "Send",
                            id: "send",
                            // icon: iconsMap["ios-send-outline"],
                        },
                    ],
                },
            },
        ],
        tabsStyle: {
            tabBarButtonColor: "darkgray",
            tabBarSelectedButtonColor: colors.blue,
            tabBarBackgroundColor: "white",
            tabBarHideShadow: false,
            tabBarTranslucent: false,
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
