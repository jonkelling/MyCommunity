import classNames from "classnames/bind";
import { CircularProgress, Divider } from "material-ui";
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
import { connect } from "react-redux";
import uuidv1 from "uuid/v1";
import appActions from "../appActions";
import { FlatButton, Image, LinkButton, RaisedButton, Text, TextField, View } from "./ui";

const cx = classNames.bind(require("./FileUploadField.scss"));

const iconStyle: CSSProperties = {
    height: "30%",
    width: "30%",
    margin: "auto",
    verticalAlign: "middle",
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0
};

class FileUploadField extends React.Component<IFileUploadFieldProps, { acceptedFiles: any[], trackingId: string }> {
    constructor(props) {
        super(props);
        this.state = {
            acceptedFiles: [],
            trackingId: uuidv1(),
        };
        this.attachFile = this.attachFile.bind(this);
    }
    public componentWillReceiveProps(nextProps: IFileUploadFieldProps) {
        const newFileName =
            nextProps.uploadedFileNames.length &&
            nextProps.uploadedFileNames[0];
        const oldFileName =
            this.props.uploadedFileNames.length &&
            this.props.uploadedFileNames[0];
        if (newFileName !== oldFileName) {
            this.props.onFileReady(newFileName);
        }
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
                    position: "relative",
                    textAlign: "center",
                }}
                activeClassName={cx("dropzone-active")}
                rejectClassName={cx("dropzone-reject")}
                disablePreview
                className={cx(["dropzone", { "dropzone-done": this.state.acceptedFiles.length }])}
                onDrop={this.attachFile}
            >
                {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => (
                    (isDragActive && IconWrapper(<FileCloudUpload style={iconStyle} />)) ||
                    (isDragReject && IconWrapper(<NavigationCancel style={iconStyle} />)) ||
                    (acceptedFiles.length && IconWrapper(<CircularProgress />)) ||
                    IconWrapper(<ImageAddAPhoto style={iconStyle} />)
                )}
            </Dropzone>
        </View>;
    }

    public componentWillUnmount() {
        this.destroyActivePreview();
    }

    private attachFile(acceptedFiles, rejectedFiles) {
        console.log(acceptedFiles);
        this.destroyActivePreview();
        this.destroyActivePreview(rejectedFiles);
        this.setState({ acceptedFiles });
        if (acceptedFiles.length) {
            this.props.uploadFile(1, acceptedFiles[0], "fileUpload", this.onSuccess, this.onFailure);
        }
        return;
    }

    private destroyActivePreview(files = this.state.acceptedFiles) {
        if (files.length) {
            window.URL.revokeObjectURL(files[0].preview);
        }
    }

    private onSuccess(response) {
        console.log("============ SUCCESS ===============");
        console.log(response);
        console.log("====================================");
    }

    private onFailure(response) {
        console.log("============ FAILURE ===============");
        console.log(response.body);
        console.log("====================================");
    }
}

interface IFileUploadFieldProps {
    uploadFile: (
        commnityId: number,
        file: File,
        source: string,
        onSuccess: (response) => any,
        onFailure: (response) => any) => any;
    onFileReady?: (url: string) => any;
    loading: boolean;
    trackingId: string;
    uploadedFileNames: string[];
}

function mapStateToProps(state) {
    return {
        loading: state.app.loading.fileUpload,
        uploadedFileNames: state.fileUploads.uploadedFileNames,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uploadFile: (
            communityId: number, file: File, source: string,
            onSuccess: (response) => any, onFailure: (response) => any) =>
            dispatch(appActions.uploadFile(communityId, file, source, onSuccess, onFailure))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadField);
