import classNames from "classnames/bind";
import { DatePicker, Divider, Subheader, TimePicker } from "material-ui";
import moment from "moment";
import React from "react";
import BrowserDetection from "react-browser-detection";
import IPost from "../IPost";
import EditPostHeadlineImage from "./EditPostHeadlineImage";
import FileUploadField from "./FileUploadField";
import ScrollableDialog from "./ScrollableDialog";
import { RaisedButton, TextField, View } from "./ui";
import FormattedDateText from "./ui/FormattedDateText";

const cx = classNames.bind(require("./EditPost.scss"));

export default class EditPost extends React.Component<IEditPostProps, {}> {
    constructor(props) {
        super(props);
        this.onImageUploaded = this.onImageUploaded.bind(this);
        this.onImageRemoved = this.onImageRemoved.bind(this);
        this.updateField = this.updateField.bind(this);
        this.updateDateField = this.updateDateField.bind(this);
        this.save = this.save.bind(this);
    }
    public render() {
        const content = () => {
            if (!this.props.post) {
                return null;
            }
            const MUIDateAndTimePicker = () => <div>
                <DatePicker autoOk
                    name="expireDateTime"
                    onChange={this.updateDateField}
                    value={this.props.post.expireDateTime && new Date(this.props.post.expireDateTime)}
                    floatingLabelText={
                        `Expiration date & time${!!this.props.post.expireDateTime ? "" : " (not set)"}`
                    }
                    floatingLabelStyle={{ whiteSpace: "nowrap" }}
                    style={{ display: "inline-block", width: "auto" }}
                    textFieldStyle={{ width: "auto" }} />
                <TimePicker
                    onChange={this.updateDateField}
                    value={this.props.post.expireDateTime && new Date(this.props.post.expireDateTime)}
                    floatingLabelText="&nbsp;"
                    style={{ display: "inline-block", width: "auto" }}
                    textFieldStyle={{ width: "auto" }} />
            </div>;
            const browserHandler = {
                safari: MUIDateAndTimePicker,
                unknown: MUIDateAndTimePicker,
                default: (browser) => <div>
                    <TextField type="date" value={
                        this.props.post.expireDateTime &&
                        new Date(this.props.post.expireDateTime).toString()
                    } />
                    <TextField type="time" value={
                        this.props.post.expireDateTime &&
                        new Date(this.props.post.expireDateTime).toString()
                    } />
                </div>
            };
            return <div className={cx("component")}>
                <EditPostHeadlineImage
                    className={cx("headlineImage")}
                    imageUrl={this.props.post.headlineImageUrl}
                    onImageUploaded={this.onImageUploaded}
                    onImageRemoved={this.onImageRemoved} /><br />
                <View>
                    <BrowserDetection>
                        {browserHandler}
                    </BrowserDetection>
                </View>
                <TextField name="headline" hintText="Title"
                    value={this.props.post.headline}
                    onChange={this.updateField}
                    fullWidth /><br />
                <TextField name="content" hintText="Content" multiLine={true}
                    value={this.props.post.content}
                    onChange={this.updateField}
                    fullWidth /><br />
            </div>;
        };
        return <ScrollableDialog
            open={!!this.props.post}
            title="Edit Post"
            actions={[
                <RaisedButton label="Save & Close"
                    primary
                    className={cx("button")}
                    onTouchTap={this.save} />,
                <RaisedButton label="Cancel"
                    className={cx("button")}
                    onTouchTap={this.props.cancel} />
            ]}
            bodyStyle={{ height: "50% !important", maxHeight: "200px !important" }}
            autoDetectWindowHeight>
            {content()}
        </ScrollableDialog>;
    }
    private onImageUploaded(imageUrl) {
        this.props.updateEdits("post", { headlineImageUrl: imageUrl });
    }
    private onImageRemoved() {
        this.props.updateEdits("post", { headlineImageUrl: null });
    }
    private updateField(event) {
        this.props.updateEdits("post", { [event.target.name]: event.target.value });
    }
    private updateDateField(event, date) {
        this.props.updateEdits("post", { expireDateTime: date });
    }
    private save() {
        this.props.save(this.props.communityId, this.props.post);
    }
}

interface IEditPostProps {
    communityId: number;
    post?: IPost;
    updateEdits: any;
    save: any;
    cancel: any;
}
