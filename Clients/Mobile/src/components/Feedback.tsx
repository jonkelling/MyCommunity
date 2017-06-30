import React from "react";
import { ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { BlurView } from "react-native-blur";
import { Navigator } from "react-native-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import appActions from "../appActions";
import editsActions from "../editsActions";
import IFeedback from "../IFeedback";
import { Divider, Text, View } from "../ui";
import Card from "./Card";
import Overlay from "./Overlay";
import Spinner from "./Spinner";
import Tile from "./Tile";

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    absolute: {
        position: "absolute",
        top: 0, left: 0, bottom: 0, right: 0,
    },
});

class Feedback extends React.Component<IFeedbackProps, {}> {
    constructor(props) {
        super(props);
        this.onNavigatorEvent = this.onNavigatorEvent.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    public componentWillReceiveProps(nextProps: IFeedbackProps) {
        this.props.navigator.setButtons({
            leftButtons: [],
            rightButtons: [
                {
                    title: "Send",
                    id: "send",
                    disabled: !nextProps.edits.message || this.isSendingFeedback(nextProps),
                },
            ],
            animated: false
        });
    }
    public render() {
        return <View style={{ flex: 1 }}>
            <View style={{ opacity: this.isSendingFeedback() ? 0.2 : 1.0 }} styleName="flexible">
                <View style={{
                    borderBottomColor: "lightgray",
                    borderBottomWidth: 1,
                    marginTop: 6,
                    marginLeft: 14,
                }}>
                    <TextInput
                        style={{ height: 40, }}
                        multiline={false}
                        numberOfLines={1}
                        placeholder="Subject (optional)"
                        returnKeyType="next"
                        onChangeText={this.updateField.bind(this, "subject")}
                        value={this.props.edits.subject} />
                </View>
                <View style={{
                    marginTop: 6,
                    marginLeft: 14,
                    flex: 1,
                }}>
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 14
                        }}
                        placeholder="Message"
                        multiline={true}
                        editable={true}
                        onKeyPress={this.onKeyPress}
                        onChangeText={this.updateField.bind(this, "message")}
                        value={this.props.edits.message} />
                </View>
            </View>
            {this.renderPleaseWait()}
        </View>;
    }
    private isSendingFeedback(props = this.props) {
        return props.app.loading.sendFeedback;
    }
    private renderPleaseWait() {
        if (!this.isSendingFeedback()) {
            return null;
        }
        return <BlurView style={styles.absolute} blurType="light">
            <View styleName="flexible fill-parent vertical h-center v-center">
                <Text styleName="white">Sending feedback. Please wait.</Text>
                <Divider />
                <ActivityIndicator animating={true} size="large" />
            </View>
        </BlurView>;
    }
    private onNavigatorEvent(event: any) {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "send") {
                this.sendFeedback();
            }
        }
    }
    private onKeyPress(event) {
        return;
    }
    private updateField(field, text) {
        this.props.editsActions.updateEdits("sendFeedback", { [field]: text });
    }
    private sendFeedback() {
        this.props.saveFeedback(
            this.props.app.currentUser.id,
            this.props.app.currentUser.communityId,
            this.props.edits
        );
    }
}

interface IFeedbackProps {
    app: any;
    edits: IFeedback;
    navigator: Navigator;
    editsActions: typeof editsActions;
    saveFeedback: typeof appActions.saveFeedback;
}

function mapStateToProps(state) {
    return {
        app: state.app,
        edits: state.edits.sendFeedback || {},
    };
}

function mapDispatchToProps(dispatch) {
    return {
        editsActions: bindActionCreators(editsActions, dispatch),
        saveFeedback: bindActionCreators(appActions.saveFeedback, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
