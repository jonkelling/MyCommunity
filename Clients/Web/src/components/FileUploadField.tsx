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
    Image,
    LinkButton,
    RaisedButton,
    Text,
    TextField,
    View
} from "./ui";

const cx = classNames.bind(require("./FileUploadField.scss"));

const iconStyle: CSSProperties = {
    height: "30%",
    width: "30%",
    margin: "auto",
    verticalAlign: "middle",
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0
};

export default class FileUploadField extends React.Component<IFileUploadFieldProps, { acceptedFiles: any[] }> {
    constructor(props) {
        super(props);
        this.state = {
            acceptedFiles: []
        };
        this.attachFile = this.attachFile.bind(this);
    }

    public render() {
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
                    position: "relative",
                    height: "100%",
                    width: "100%",
                }} />
                {children}
            </View>
        </View>;

        return <View className={cx("component")}>
            <Dropzone accept="image/png,image/jpeg"
                style={{
                    width: 150,
                    minHeight: 100,
                    position: "relative",
                    textAlign: "center",
                }}
                activeClassName={cx("dropzone-active")}
                rejectClassName={cx("dropzone-reject")}
                className={cx(["dropzone", { "dropzone-done": this.state.acceptedFiles.length }])}
                onDrop={this.attachFile}
            >
                {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => (
                    (isDragActive && IconWrapper(<FileCloudUpload style={iconStyle} />)) ||
                    (isDragReject && IconWrapper(<NavigationCancel style={iconStyle} />)) ||
                    (acceptedFiles.length && <Image src={acceptedFiles[0].preview} />) ||
                    IconWrapper(<ImageAddAPhoto style={iconStyle} />)
                )}
            </Dropzone>
        </View>;
    }

    private attachFile(acceptedFiles, rejectedFiles) {
        console.log("====================================");
        console.log(acceptedFiles);
        console.log("====================================");
        this.setState({ acceptedFiles });
        return;
    }
}

interface IFileUploadFieldProps {
    save?: any;
    cancel?: any;
}
