import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "./appActions";
// tslint:disable-next-line:ordered-imports
import { community, communityList, user, userList } from "./schemas";
// tslint:disable-next-line:no-var-requires
const { CALL_API } = require("redux-api-middleware");
import Enumerable from "../node_modules/linq/linq";

class DemoScreen extends React.Component<IDemoScreenProps, {}> {
    public componentWillMount() {
        if (!this.props.email) { return; }
        this.props.actions.loadCurrentUser();
        // tslint:disable:curly
        if (this.props.entities)
            if (this.props.entities.users) {
                const currentUser = Enumerable
                    .from(this.props.entities.users)
                    .select((x) => x.value)
                    .singleOrDefault((x) => x.email === this.props.email);
                this.props.actions.loadCommunity(currentUser.communityId);
                this.props.actions.loadNewestPosts(currentUser.communityId);
            }
    }
    public componentWillReceiveProps(nextProps: IDemoScreenProps) {
        if (!nextProps.email) { return; }
    }
    public render() {
        return (
            <View>
                <Text>go get some community.</Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        entities: state.entities,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        actions: bindActionCreators(appActions, dispatch),
    };
}

interface IDemoScreenProps {
    email: string;
    entities: any;
    actions: any;
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoScreen);
