import React, { useState } from 'react';
import { connect } from 'react-redux';
import { deleteImage } from '../store/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import "./Gallery.css"

const Gallery = ({ capturedImages, deleteImage }) => {
  const imagesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleDelete = (index) => {
    deleteImage(currentPage * imagesPerPage + index);
  };

  const renderImages = () => {
    const startIndex = currentPage * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, capturedImages.length);
    const visibleImages = capturedImages.slice(startIndex, endIndex);

    return visibleImages.map((image, index) => (
      <div key={index} className="image-container">
        <img src={image} alt={`Image ${startIndex + index}`} />
        <button onClick={() => handleDelete(index)} className="delete-button">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    ));
  };

  const pageCount = Math.ceil(capturedImages.length / imagesPerPage) || 1;

  return (
    <>
    <div className="gallery">
      {renderImages()}
    </div>
     {pageCount > 1 && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            previousLinkClassName={'previous'}
            nextLinkClassName={'next'}
            disabledClassName={'disabled'}
            activeClassName={'active'}
          />
        </div>
      )}
    </>
    
  );
};

const mapStateToProps = (state) => ({
  capturedImages: state.images,
});

export default connect(mapStateToProps, { deleteImage })(Gallery);
