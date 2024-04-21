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
  const [selectedCamera, setSelectedCamera] = useState('front');

  const updateVideoConstraints = useCallback(() => {
    if (aspectRatio === '16:9') {
      setVideoWidth(540);
      setVideoHeight(302);
    } else if (aspectRatio === '4:3') {
      setVideoWidth(540);
      setVideoHeight(405);
    } else if (aspectRatio === '1:1') {
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

  const capturePhoto = useCallback(async () => {
    try {
      setLoading(true);
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      const visibleWidth = video.clientWidth * zoom;
      const visibleHeight = video.clientHeight * zoom;
  
      canvas.width = visibleWidth;
      canvas.height = visibleHeight;
  
      if (aspectRatio === '16:9') {
        const croppedWidth = visibleHeight * (16 / 9);
        const xOffset = (visibleWidth - croppedWidth) / 2;
        context.drawImage(video, xOffset, 0, croppedWidth, visibleHeight, 0, 0, croppedWidth, visibleHeight);
      } else if (aspectRatio === '4:3') {
        const croppedWidth = visibleHeight * (4 / 3);
        const xOffset = (visibleWidth - croppedWidth) / 2;
        context.drawImage(video, xOffset, 0, croppedWidth, visibleHeight, 0, 0, croppedWidth, visibleHeight);
      } else if (aspectRatio === '1:1') {
        const minDimension = Math.min(visibleWidth, visibleHeight);
        canvas.width = minDimension;
        canvas.height = minDimension;
        const xOffset = (visibleWidth - minDimension) / 2;
        const yOffset = (visibleHeight - minDimension) / 2;
        context.drawImage(video, xOffset, yOffset, minDimension, minDimension, 0, 0, minDimension, minDimension);
      } else {
        context.drawImage(video, 0, 0, visibleWidth, visibleHeight);
      }
  
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
          audio={true}
          screenshotFormat='image/png'
          videoConstraints={videoConstraints}
          mirrored={true}
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
      <div className="controls">
        <div>
          <button onClick={capturePhoto} disabled={loading}>
            {loading ? 'Capturing...' : 'Capture'}
          </button>
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
        </div>
        <div>
          <button onClick={() => handleAspectRatioChange('16:9')}>16:9</button>
          <button onClick={() => handleAspectRatioChange('4:3')}>4:3</button>
          <button onClick={() => handleAspectRatioChange('1:1')}>1:1</button>
        </div>
        <select value={selectedCamera} onChange={handleCameraChange}>
           <option value="front">Front Cam</option>
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
