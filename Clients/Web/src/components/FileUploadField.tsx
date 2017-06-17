import classNames from "classnames/bind";
import { Divider } from "material-ui";
import {
    FileCloudDone,
    FileCloudQueue,
    FileCloudUpload,
    ImageAddAPhoto,
    ImageCropFree,
    NavigationCancel
} from "material-ui/svg-icons";
import React, { CSSProperties } from "react";
import Dropzone from "react-dropzone";
import {
    FlatButton,
    LinkButton,
    RaisedButton,
    Text,
    TextField,
    View
} from "./ui";

const cx = classNames.bind(require("./EditPost.scss"));

export default class FileUploadField extends React.Component<IFileUploadFieldProps, {}> {
    constructor(props) {
        super(props);
        this.fileChanged = this.fileChanged.bind(this);
    }

    public render() {
        const iconStyle: CSSProperties = {
            height: "30%",
            width: "30%",
            margin: "auto",
            verticalAlign: "middle",
            position: "absolute",
            left: 0, right: 0, top: 0, bottom: 0
        };

        const IconWrapper = (children) => <View>
            <Text defaultCursor>
                Drag an image or <LinkButton>
                    click here
                </LinkButton> to upload
            </Text>
            <View style={{
                position: "relative",
                height: 100,
                width: 100,
                margin: "auto",
            }}>
                <ImageCropFree style={{
                    color: "lightgray",
                    position: "relative",
                    height: "100%",
                    width: "100%",
                }} />
                {children}
            </View>
        </View>;

        return <View>
            <Dropzone accept="image/png,image/jpeg"
                style={{
                    width: 150,
                    minHeight: 100,
                    position: "relative",
                    textAlign: "center",
                }}
            >
                {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                    if (isDragActive) {
                        return IconWrapper(<FileCloudUpload style={iconStyle} />);
                    }
                    if (isDragReject) {
                        return IconWrapper(<NavigationCancel style={iconStyle} color="red" />);
                    }
                    return acceptedFiles.length || rejectedFiles.length
                        ? `Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`
                        : IconWrapper(<ImageAddAPhoto style={iconStyle} color="lightgray" />);
                }}
            </Dropzone>
        </View>;
    }

    private fileChanged(event) {
        return;
    }
}

interface IFileUploadFieldProps {
    save?: any;
    cancel?: any;
}
