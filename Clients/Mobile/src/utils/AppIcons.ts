import { PixelRatio, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const navIconSize = (__DEV__ === false && Platform.OS === "android") ? PixelRatio.getPixelSizeForLayoutSize(40) : 40;
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = [
    { source: Ionicons, name: "ios-film", size: [30] },
    { source: Ionicons, name: "ios-film-outline", size: [30] },
    { source: Ionicons, name: "ios-home-outline", size: [30] },
    { source: Ionicons, name: "ios-home", size: [30] },
    { source: MaterialIcons, name: "home", size: [30] },
    { source: MaterialIcons, name: "feedback", size: [30] },
    { source: Ionicons, name: "ios-send-outline", size: [navIconSize] },
    { source: Ionicons, name: "ios-desktop-outline", size: [30] },
    { source: Ionicons, name: "ios-desktop", size: [30] },
    { source: Ionicons, name: "ios-search", size: [30] },
    { source: Ionicons, name: "ios-arrow-round-down", size: [navIconSize] },
    { source: Ionicons, name: "ios-close", size: [40] },
];

const iconsMap = {};
const iconsLoaded = new Promise((resolve, reject) => {
    Promise.all(
        icons.map((icon) =>
            icon.source.getImageSource(
                icon.name.replace(replaceSuffixPattern, ""),
                icon.size[0],
                icon.size[1],
            )),
    ).then((sources) => {
        icons.forEach((icon, idx) => iconsMap[icon.name] = sources[idx]);
        resolve(true);
    });
});

export {
    iconsLoaded,
    iconsMap,
};
