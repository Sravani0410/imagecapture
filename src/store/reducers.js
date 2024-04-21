import { ADD_IMAGE, SET_LOADING, SET_ERROR, DELETE_IMAGE } from './actions'; 

const initialState = {
  images: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_IMAGE:
      return {
        ...state,
        images: [...state.images, action.payload],
      };
      case DELETE_IMAGE:
        return {
          ...state,
          images: state.images.filter((_, index) => index !== action.payload.index),
        };
      default:
        return state;
  }
};

export default rootReducer;
