import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// tslint:disable-next-line:ordered-imports
import { user, community } from "./schemas";

class DemoScreen extends React.Component<{ email: string, entities: any, actions: any }, {}> {
    public componentWillMount() {
        if (!this.props.email) { return; }
        this.props.actions.loadUsers(this.props.email);
        // tslint:disable:curly
        if (this.props.entities)
            if (this.props.entities.users)
                if (this.props.entities.users[0])
                    this.props.actions.loadCommunity();
    }
    public componentWillReceiveProps(nextProps: any) {
        if (!nextProps.email) { return; }
        if (this.props.email !== nextProps.email) {
            nextProps.actions.loadUsers(nextProps.email);
        }
        if (nextProps.entities)
            if (nextProps.entities.users)
                if (nextProps.entities.users["1"])
                    if (nextProps.entities.users["1"].communityId)
                        if ((this.props.entities &&
                            this.props.entities.users &&
                            this.props.entities.users["1"] &&
                            this.props.entities.users["1"].communityId ||
                            null) !== nextProps.entities.users["1"].communityId)
                            nextProps.actions.loadCommunity(nextProps.entities.users["1"].communityId);
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

function mapDispatchToProps(dispatch2, ownProps) {
    return {
        actions: bindActionCreators(({
            loadCommunity: (id) => async (dispatch) => {
                const endpoint = `http://localhost:5000/api/v1/communities/${id}`;
                try {
                    // Make the API call
                    const response = await fetch(endpoint);
                    const json = await response.json();
                    dispatch({
                        meta: {
                            schema: community,
                        },
                        payload: json,
                        type: "SUCCESS",
                    });
                } catch (e) {
                    // The request was malformed, or there was a network error
                    return;
                }
            },
            loadUsers: (email) => async (dispatch) => {
                const endpoint = `http://localhost:5000/api/v1/users?email=${email}`;
                try {
                    // Make the API call
                    const response = await fetch(endpoint);
                    const json = await response.json();
                    dispatch({
                        meta: {
                            schema: [user],
                        },
                        payload: json,
                        type: "SUCCESS",
                    });
                } catch (e) {
                    // The request was malformed, or there was a network error
                    return;
                }
            },
        }), dispatch2),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoScreen);
