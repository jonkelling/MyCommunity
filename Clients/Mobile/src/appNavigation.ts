
import Navigation, { NavigatorStyle } from "react-native-navigation";
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

export function startApp() {
    Navigation.setRoot({
        tabs: [
            {
                label: "Home",
                container: { name: "app.Home" },
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
}

export function startNoCommunityAssigned() {
    Navigation.setRoot({
        container: {
            name: ScreenId.NoCommunityAssigned,
            title: "Welcome!",
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: true,
            },
        },
    });
}

export function startLoadingScreen() {
    Navigation.setRoot({
        container: {
            name: ScreenId.Loading,
            title: "Welcome!",
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: true,
            },
        },
    });
}
