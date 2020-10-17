import React, { Component } from 'react'
import Camera, {FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo';

import 'react-html5-camera-photo/build/css/index.css';
import './imageDemand.css';
// import '../demand.css';

class ImageDemand extends Component {
    state={
        images:[],
        activeImage:'',
        openCamera:true,

    }

    handleTakePhoto= (dataUri) =>{
        let img ={idx:this.state.images.length, image:dataUri}
        let images=[...this.state.images]
        images.push(img)
        this.setState({images})
    }

    onImageUpload=(event)=>{
        if(event.target.files.length===1)
        {
            let images =[{idx:this.state.images.length, image:URL.createObjectURL(event.target.files[0])}, ...this.state.images]
            this.setState({images});
        }
    }

    dspImgDmdBtns=()=>{
        return(
            !this.state.openCamera?<div className="img-dmd-btns">
                <input type='file' id='upld-img-btn' accept="image/png, image/jpeg" hidden onChange={this.onImageUpload} />
                <label className="import-image-btn" htmlFor='upld-img-btn'>
                    Import photo
                </label>

                <div className="open-camera"  onClick={()=>this.setState({openCamera:true})}>
                    <button>
                        Take photo
                        <i className="fa fa-camera"/>
                    </button>
                </div>
            </div>:null
        )
    }

    removeImage=(index)=>{
        let images = this.state.images.filter(img=>img.idx!==index)
        this.setState({images, activeImage:''})
    }

    openImg=(index)=>{
        this.setState({openCamera:false,activeImage:index})
    }

    dspImages=()=>{
        return(
            !this.state.openCamera && this.state.activeImage===''?<div className="to-be-upldd-imgs">
                { this.state.images.map(img=>{
                    let {idx, image} =img
                    return(
                        <div className="dmd-img" key={idx}>
                            <img src={image} alt={`demand ${idx}`} onClick={()=>this.openImg(idx)} />
                            <i className="fa fa-times remove-img" onClick={()=>this.removeImage(idx)} />
                        </div>
                    )
                }) }
            </div>:null
        )
    }

    dispParticularImg=()=>{
        return(
            this.state.activeImage!=='' && !this.state.openCamera && !isNaN(Number(this.state.activeImage))?
            <div className="an-open-img">
                <img src={this.state.images[this.state.activeImage].image} alt="a-demand" />
                <div className="img-btns">
                    <i className="fa fa-times close-img" onClick={()=>this.setState({activeImage:''})} />
                    <i className="fa fa-trash delete-img" onClick={()=>this.removeImage(this.state.images[this.state.activeImage].idx)} />
                </div>
            </div>:null
        )
    }

    render() {
        return (
            <div className='demand-holder'>
                {
                    this.state.openCamera?
                    <div className="camera-holder">
                        <Camera
                            onTakePhoto={(dataUri)=>{this.handleTakePhoto(dataUri)}}
                            isImageMirror={false}
                            idealFacingMode={FACING_MODES.ENVIRONMENT}
                            imageType={IMAGE_TYPES.JPG}
                            imageCompression={0}
                            isMaxResolution={true}
                            isSilentMode={false}
                            isDisplayStartCameraError={true}
                            sizeFactor={1}
                            // idealResolution={{width:200, height:200}}
                        />
                        <i className="fa fa-times close-camera" onClick={()=>this.setState({openCamera:false})} />
                    </div>
                    :null
                }
                {this.dspImgDmdBtns()}
                {this.dspImages()}
                {this.dispParticularImg()}

                <div className="img-dmd-pg-ctrl-btns">
                    <button className="img-dmd-back-btn">Back</button>
                    <button className="img-dmd-nxt-btn" disabled={this.state.images.length!==0}>Next</button>
                </div>
                
            </div>
        )
    }
}

export default ImageDemand