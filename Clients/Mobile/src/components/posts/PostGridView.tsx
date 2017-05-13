// tslint:disable-next-line:no-reference
/// <reference path="../../../node_modules/moment/moment.d.ts"/>
import isEqual from "lodash.isequal";
import React from "react";
import { Navigator } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "../../../node_modules/linq/linq";
import appActions from "../../appActions";
import Post from "./Post";
// import { TouchableOpacity } from "react-native";
const {
    Screen,
    Divider,
    Image,
    TouchableOpacity,
    Title,
    Subtitle,
    Tile,
    View,
    Card,
    ListView,
    Caption,
    GridRow,
    // tslint:disable-next-line:no-var-requires
} = require("@shoutem/ui");
// tslint:disable-next-line:no-var-requires
const moment = require("moment");

class PostGridView extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }
    public render() {
        let isFirstArticle = true;
        const groupedData = GridRow.groupByRows(this.props.posts, 2, () => {
            if (isFirstArticle) {
                isFirstArticle = false;
                return 2;
            }

            return 1;
        });
        return (
            <Screen>
                <ListView
                    data={groupedData}
                    renderRow={this.renderRow}
                />
            </Screen>
        );
    }

    private renderRow(rowData, sectionId, index) {
        // rowData contains grouped data for one row,
        // so we need to remap it into cells and pass to GridRow

        if (index === "0") {
            // tslint:disable:max-line-length
            return (
                <TouchableOpacity key={index}>
                    <Image
                        styleName="large"
                        // tslint:disable-next-line:max-line-length
                        source={{ uri: rowData[0].headlineImageUrl || "http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg" }}
                    >
                        <Tile>
                            <Title styleName="md-gutter-bottom">{rowData[0].headline}</Title>
                            <Subtitle styleName="sm-gutter-horizontal" numberOfLines={2}>{rowData[0].content}</Subtitle>
                        </Tile>
                    </Image>
                    <Divider styleName="line" />
                </TouchableOpacity>
            );
            // tslint:enable:max-line-length
        }

        const cellViews = rowData.map((post, id) => {
            return (
                <TouchableOpacity key={id} styleName="flexible">
                    <Card styleName="flexible">
                        <Image
                            styleName="large"
                            // tslint:disable-next-line:max-line-length
                            source={{ uri: post.headlineImageUrl || "http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg" }}
                        />
                        <View styleName="content">
                            <Subtitle numberOfLines={3}>{post.headline}</Subtitle>
                            {/*<View styleName="horizontal">
                                <Caption styleName="collapsible" numberOfLines={2}>{post.content}</Caption>
                            </View>*/}
                            <View styleName="horizontal v-center space-between">
                                <Caption>{moment(rowData[0].createdDateTime).toString()}</Caption>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            );
        });
        return (
            <GridRow columns={2}>
                {cellViews}
            </GridRow>
        );
    }

}

function mapStateToProps(state: any, ownProps: any) {
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
        app: state.app,
        posts: state.entities.posts && Enumerable.from(state.entities.posts)
            .select((x) => x.value)
            .orderByDescending((post) => post.createdDateTime)
            .toArray(),
        users: state.entities.users,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        actions: bindActionCreators(appActions, dispatch),
    };
}

interface IPostListProps {
    actions: any;
    app: any;
    navigator: Navigator;
    posts: any[];
    users: any[];
}

export default connect(mapStateToProps, mapDispatchToProps)(PostGridView);
