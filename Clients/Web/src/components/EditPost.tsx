import classNames from "classnames/bind";
import { Divider } from "material-ui";
import React from "react";
import IPost from "../IPost";
import FileUploadField from "./FileUploadField";
import ScrollableDialog from "./ScrollableDialog";
import { RaisedButton, TextField } from "./ui";

const cx = classNames.bind(require("./EditPost.scss"));

export default class EditPost extends React.Component<IEditPostProps, {}> {
    constructor(props) {
        super(props);
        this.updateField = this.updateField.bind(this);
        this.save = this.save.bind(this);
    }
    public render() {
        const content = () => {
            if (!this.props.post) {
                return null;
            }
            return <div className={cx("component")}>
                <TextField name="headline" hintText="Title"
                    value={this.props.post.headline}
                    onChange={this.updateField}
                    fullWidth /><br />
                <TextField name="content" hintText="Content" multiLine={true}
                    value={this.props.post.content}
                    onChange={this.updateField}
                    fullWidth /><br />
                <FileUploadField onFileReady={(filename) => null} /><br/>
            </div>;
        };
        return <ScrollableDialog
            open={!!this.props.post}
            title="Edit Post"
            actions={[
                <RaisedButton label="Save"
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
    private updateField(event) {
        this.props.updateEdits("post", { [event.target.name]: event.target.value });
    }
    private save() {
        this.props.save(this.props.post);
    }
}

interface IEditPostProps {
    communityId: number;
    post?: IPost;
    updateEdits: any;
    save: any;
    cancel: any;
}
