import { PixelRatio, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const navIconSize = (__DEV__ === false && Platform.OS === "android") ? PixelRatio.getPixelSizeForLayoutSize(40) : 40;
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
    "ios-film-outline": [30],
    "ios-film": [30],
    "ios-home-outline": [30],
    "ios-home": [30],
    "ios-desktop-outline": [30],
    "ios-desktop": [30],
    "ios-search": [30],
    "ios-arrow-round-down": [navIconSize],
    "ios-close": [40]
};

const iconsMap = {};
const iconsLoaded = new Promise((resolve, reject) => {
    Promise.all(
        Object.keys(icons).map((iconName) =>
            Ionicons.getImageSource(
                iconName.replace(replaceSuffixPattern, ""),
                icons[iconName][0],
                icons[iconName][1],
            )),
    ).then((sources) => {
        Object.keys(icons)
            .forEach((iconName, idx) => (iconsMap[iconName] = sources[idx]));

        // Call resolve (and we are done)
        resolve(true);
    });
});

export {
    iconsLoaded,
    iconsMap,
};
