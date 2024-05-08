import "./App.css";
import { useState } from "react";
import Cameras from "./components/Cameras";

function App() {
  const [selectedCamera, setSelectedCamera] = useState('front');
  const [zoom, setZoom] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);

  const handleCameraToggle = () => {
    setSelectedCamera(selectedCamera === 'user' ? 'environment' : 'user');
  };

  const handleCapture = (imageSrc) => {
    setPreviewImage(imageSrc);
    setCapturedImages([...capturedImages, imageSrc]);
  };
  return (
    <div className="App">
      <h1>Image Capture</h1>
      <Cameras 
        selectedCamera={selectedCamera}
        onCameraToggle={handleCameraToggle}
        onCapture={handleCapture}
        zoom={zoom} />
    </div>
  );
}

export default App;
