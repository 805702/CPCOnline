import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";

import "react-html5-camera-photo/build/css/index.css";
import "./imageDemand.css";
// import '../demand.css';

class ImageDemand extends Component {
  state = {
    binary_images: [],
    images:[],
    activeImage: "",
    openCamera: false,
  };

  componentDidMount() {
    this.setState({ images: this.props.images, binary_images:this.props.binary_images });
  }

  handleTakePhoto = (dataUri) => {
    let img = { idx: this.state.images.length, image: dataUri };
    let images = [...this.state.images];
    images.push(img);
    this.setState({ images });
  };

  onImageUpload = (event) => {
    if (event.target.files.length === 1) {
        
      let binary_images = [ { idx: this.state.images.length, image: event.target.files[0] }, ...this.state.binary_images, ];
      
      let images = [ { idx:this.state.images.length, image:URL.createObjectURL(event.target.files[0]) }, ...this.state.images ]

      this.setState({ images, binary_images });
    }
  };

  dspImgDmdBtns = () => {
    return !this.state.openCamera ? (
      <div className="img-dmd-btns">
        <input
          type="file"
          id="upld-img-btn"
          accept="image/png, image/jpeg"
          hidden
          onChange={this.onImageUpload}
        />
        <label className="import-image-btn" htmlFor="upld-img-btn">
          Import photo
        </label>

        <div
          className="open-camera"
          onClick={() => this.setState({ openCamera: true })}
        >
          <button>
            Take photo
            <i className="fa fa-camera" />
          </button>
        </div>
      </div>
    ) : null;
  };

  removeImage = (index) => {
    let images = this.state.images.filter((img) => img.idx !== index);
    let binary_images = this.state.binary_images.filter((_) => _.idx !== index)

    binary_images = binary_images.map((img, index)=>{
        return { idx:index, image: img.image }
    })

    images = images.map((image, idx) => {
      return { idx: idx, image: image.image };
    });

    this.setState({ images, binary_images, activeImage: "" });
  };

  openImg = (index) => {
    this.setState({ openCamera: false, activeImage: index });
  };

  dspImages = () => {
    return !this.state.openCamera && this.state.activeImage === "" ? (
      <Scrollbars style={{ height: 330 }}>
        <div className="to-be-upldd-imgs">
          {this.state.images.map((img) => {
            let { idx, image } = img;
            return (
              <div className="dmd-img" key={idx}>
                <img
                  src={image}
                  alt={`demand ${idx}`}
                  onClick={() => this.openImg(idx)}
                />
                <i
                  className="fa fa-trash remove-img"
                  onClick={() => this.removeImage(idx)}
                />
              </div>
            );
          })}
        </div>
      </Scrollbars>
    ) : null;
  };

  dispParticularImg = () => {
    let image = this.state.images.find(
      (image) => image.idx === this.state.activeImage
    );
    return this.state.activeImage !== "" &&
      !this.state.openCamera &&
      !isNaN(Number(this.state.activeImage)) ? (
      <div className="an-open-img">
        <img src={image.image} alt="a-demand" />
        <div className="img-btns">
          <i
            className="fa fa-trash delete-img"
            onClick={() => this.removeImage(image.idx)}
          />
          <i
            className="fa fa-times close-img"
            onClick={() => this.setState({ activeImage: "" })}
          />
        </div>
      </div>
    ) : null;
  };

  render() {
    return (
      <React.Fragment>
        <div className="demand-holder">
          {this.state.openCamera ? (
            <div className="camera-holder">
              <Camera
                onTakePhoto={(dataUri) => {
                  this.handleTakePhoto(dataUri);
                }}
                isImageMirror={false}
                idealFacingMode={FACING_MODES.ENVIRONMENT}
                imageType={IMAGE_TYPES.JPG}
                imageCompression={0}
                isMaxResolution={true}
                isSilentMode={false}
                isDisplayStartCameraError={true}
                sizeFactor={1}
              />
              <i
                className="fa fa-times close-camera"
                onClick={() => this.setState({ openCamera: false })}
              />
            </div>
          ) : null}
          {this.dspImgDmdBtns()}
          {this.dspImages()}
          {this.dispParticularImg()}
        </div>

        <div className="idnt-btns">
          <button
            className="btn-cancel"
            onClick={() => window.location.assign("/home")}
          >
            <i className="fa fa-arrow-left">Back</i>
          </button>
          <button
            className="btn-nxt"
            disabled={this.state.images.length === 0}
            onClick={() => this.props.onNext("next", this.state.images, this.state.binary_images)}
          >
            Next
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default ImageDemand;
