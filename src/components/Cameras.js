import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { connect } from "react-redux";
import { addImage, setLoading, setError } from "../store/actions";
import "./Cameras.css";
import Gallery from "./gallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faPlus,
  faMinus,
  faSync,
  faCameraRotate,
} from "@fortawesome/free-solid-svg-icons";

const Cameras = ({ addImage, setLoading, setError, loading, error }) => {
  const webcamRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [capturedImages, setCapturedImages] = useState([]);
  const [videoWidth, setVideoWidth] = useState(540);
  const [videoHeight, setVideoHeight] = useState(302);
  const [selectedCamera, setSelectedCamera] = useState("user");

  const updateVideoConstraints = useCallback(() => {
    if (aspectRatio === "16:9") {
      setVideoWidth(540);
      setVideoHeight(302);
    } else if (aspectRatio === "4:3") {
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
  const capturePhoto = useCallback(async () => {
    try {
      setLoading(true);
      const video = webcamRef.current.video;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const visibleWidth = video.clientWidth * zoom;
      const visibleHeight = video.clientHeight * zoom;
      const videoAspectRatio = video.videoWidth / video.videoHeight;

      console.log(videoAspectRatio);
      let croppedWidth, croppedHeight;
      if (aspectRatio === "16:9") {
        croppedWidth = visibleWidth;
        croppedHeight = (visibleWidth / 16) * 9;
      } else if (aspectRatio === "4:3") {
        croppedWidth = visibleWidth;
        croppedHeight = (visibleWidth / 4) * 3;
      } else if (aspectRatio === "1:1") {
        croppedWidth = visibleWidth;
        croppedHeight = visibleWidth;
      }

      canvas.width = croppedWidth;
      canvas.height = croppedHeight;

      let xOffset = (video.videoWidth - visibleWidth) / 2;
      let yOffset = (video.videoHeight - visibleHeight) / 2;
      context.drawImage(
        video,
        xOffset,
        yOffset,
        croppedWidth / zoom,
        croppedHeight / zoom,
        0,
        0,
        croppedWidth,
        croppedHeight
      );

      const imageSrc = canvas.toDataURL("image/png");
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);
      console.log("Captured Images State:", capturedImages);
      addImage(imageSrc);
    } catch (error) {
      setError("Error capturing image");
    } finally {
      setLoading(false);
    }
  }, [webcamRef, zoom, aspectRatio, addImage, setLoading, setError]);

  useEffect(() => {
    console.log("Captured Images:", capturedImages);
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

  const handleCameraChange = () => {
    setSelectedCamera(selectedCamera === "user" ? "environment" : "user");
  };

  return (
    <div className="cameras-container">
      <div className="camera-preview">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          mirrored={true}
          style={{ transform: `scale(${zoom})` }}
        />
        <div className="zoom">
          <button onClick={handleZoomIn}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button onClick={handleZoomOut}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
        <div className="aspect-ratio-controls">
          <button onClick={() => handleAspectRatioChange("16:9")}>16:9</button>
          <button onClick={() => handleAspectRatioChange("4:3")}>4:3</button>
          <button onClick={() => handleAspectRatioChange("1:1")}>1:1</button>
        </div>
        <div className="capture-camera">
          <button onClick={capturePhoto} disabled={loading}>
            {loading ? "Capturing..." : <FontAwesomeIcon icon={faCamera} />}
          </button>
          <button onClick={handleCameraChange}>
            {selectedCamera === "user" ? (
              <FontAwesomeIcon icon={faSync} />
            ) : (
              <FontAwesomeIcon icon={faCameraRotate} />
            )}
          </button>
        </div>
      </div>
      <Gallery capturedImages={capturedImages} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.loading,
  error: state.error,
});

export default connect(mapStateToProps, { addImage, setLoading, setError })(
  Cameras
);
