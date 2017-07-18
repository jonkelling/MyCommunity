import React from "react";
import { View } from "../ui";

export default class MarketingMaterial extends React.Component {
    public render() {
        return <View>
            <h3>Marketing Material</h3>
            <hr />
            <ul>
                <li><a href="https://ksocial.blob.core.windows.net/mycommunityimages/marketing/poster5x7.png">
                    Poster 5x7</a></li>
                <li><a href="https://ksocial.blob.core.windows.net/mycommunityimages/marketing/poster8x10.png">
                    Poster 8x10</a></li>
                <li><a href="https://ksocial.blob.core.windows.net/mycommunityimages/marketing/poster8.5x11.png">
                    Poster 8.5x11</a></li>
                <li><a href="https://ksocial.blob.core.windows.net/mycommunityimages/marketing/blacktextonclear.png">
                    Small Insert</a></li>
            </ul>
        </View>;
    }
}
