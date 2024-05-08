import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { connect } from 'react-redux';
import { addImage, setLoading, setError } from '../store/actions';
import "./Cameras.css"
import Gallery from './gallery';

const Cameras = ({ addImage, setLoading, setError, loading, error }) => {
  const webcamRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [capturedImages, setCapturedImages] = useState([]);
  const [videoWidth, setVideoWidth] = useState(540);
  const [videoHeight, setVideoHeight] = useState(302);
  const [selectedCamera, setSelectedCamera] = useState('user');

  const updateVideoConstraints = useCallback(() => {
    if (aspectRatio === '16:9') {
      setVideoWidth(540);
      setVideoHeight(302);
    } else if (aspectRatio === '4:3') {
      setVideoWidth(540);
      setVideoHeight(405);
    } else if (aspectRatio === "1:1") {
      setVideoWidth(540);
      setVideoHeight(540);
    }
  }, [aspectRatio]);

  useEffect(() => {
    updateVideoConstraints();
  }, [updateVideoConstraints]);

  const videoConstraints = {
    width: videoWidth,
    height: videoHeight,
    facingMode: selectedCamera,
  };    
  const handleCameraToggle = () => {
    setSelectedCamera(selectedCamera === 'user' ? 'environment' : 'user');
  };
  const capturePhoto = useCallback(async () => {
    try {
      setLoading(true);
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      const visibleWidth = video.clientWidth * zoom;
      const visibleHeight = video.clientHeight * zoom;
      const videoAspectRatio = video.videoWidth / video.videoHeight;
  
      canvas.width = visibleWidth;
      canvas.height = visibleHeight;
  
      let croppedWidth = visibleWidth;
      let croppedHeight = visibleHeight;
      let xOffset = 0;
      let yOffset = 0;
  
      if (aspectRatio === '16:9') {
        const targetAspectRatio = 16 / 9;
        if (videoAspectRatio > targetAspectRatio) {
          croppedHeight = visibleWidth / targetAspectRatio;
          yOffset = (visibleHeight - croppedHeight) / 2;
        } else {
          croppedWidth = visibleHeight * targetAspectRatio;
          xOffset = (visibleWidth - croppedWidth) / 2;
        }
      } else if (aspectRatio === '4:3') {
        const targetAspectRatio = 4 / 3;
        if (videoAspectRatio > targetAspectRatio) {
          croppedHeight = visibleWidth / targetAspectRatio;
          yOffset = (visibleHeight - croppedHeight) / 2;
        } else {
          croppedWidth = visibleHeight * targetAspectRatio;
          xOffset = (visibleWidth - croppedWidth) / 2;
        }
      } else if (aspectRatio === '1:1') {
        if (visibleWidth < visibleHeight) {
          croppedHeight = visibleWidth;
          yOffset = (visibleHeight - croppedHeight) / 2;
        } else {
          croppedWidth = visibleHeight;
          xOffset = (visibleWidth - croppedWidth) / 2;
        }
      }
  
      context.drawImage(
        video,
        xOffset,
        yOffset,
        croppedWidth,
        croppedHeight,
        0,
        0,
        visibleWidth,
        visibleHeight
      );
  
      const imageSrc = canvas.toDataURL('image/png');
      setCapturedImages(prevImages => [...prevImages, imageSrc]);
      console.log('Captured Images State:', capturedImages);
      addImage(imageSrc);
    } catch (error) {
      setError('Error capturing image');
    } finally {
      setLoading(false);
    }
  }, [webcamRef, zoom, aspectRatio, addImage, setLoading, setError, selectedCamera]);
  
  
  useEffect(() => {
    console.log('Captured Images:', capturedImages);
  }, [capturedImages]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(1, prevZoom - 0.1));
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div className="cameras-container">
      <div className="camera-preview">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat='image/png'
          videoConstraints={videoConstraints}
          mirrored={true}
          style={{ transform: `scale(${zoom})` }}
        />
          <div className="zoom">
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          </div>
          <div className="aspect-ratio-controls">
            <button onClick={() => handleAspectRatioChange("16:9")}>
              16:9
            </button>
            <button onClick={() => handleAspectRatioChange("4:3")}>4:3</button>
            <button onClick={() => handleAspectRatioChange("1:1")}>1:1</button>
          </div>        
      </div>
      <div className="capture">
      <button onClick={capturePhoto} disabled={loading}>
          {loading ? "Capturing..." : "Capture"}
        </button>
        <select value={selectedCamera} onChange={handleCameraChange}>
          <option value="user">Front Cam</option>
          <option value="environment">Back Cam</option>
        </select>
      </div>
      <Gallery capturedImages={capturedImages} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.loading,
  error: state.error,
});

export default connect(mapStateToProps, { addImage, setLoading, setError })(Cameras);
