import React, { Component } from 'react';

interface UploadComponentProps {
    addImage: (image: string) => void;
}
class UploadComponent extends Component<UploadComponentProps> {

  upload = (event: any) => {
    const { addImage } = this.props;

    const fileReader = new FileReader();
    const file = event.target.files[0];
    fileReader.onload = (upload) => {
      addImage(String(upload.target.result));
    };

    fileReader.readAsDataURL(file);
  }
  render() {
    return (
      <input accept="image/*" type="file" onChange={this.upload} />
    );
  }
}

export default UploadComponent;
