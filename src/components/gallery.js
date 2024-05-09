import React from 'react';
import { connect } from 'react-redux';
import { deleteImage } from '../store/actions';

const Gallery = ({ capturedImages, deleteImage }) => {
  const handleDelete = (index) => {
    deleteImage(index);
  };

  return (
    <div className="gallery">
      {capturedImages.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} alt={`Image ${index}`} />
          <button onClick={() => handleDelete(index)} className="delete-button">
          <i className="fas fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  capturedImages: state.images,
});

export default connect(mapStateToProps, { deleteImage })(Gallery);
