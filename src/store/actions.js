
export const ADD_IMAGE = 'ADD_IMAGE';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const DELETE_IMAGE = 'DELETE_IMAGE'; 


export const addImage = (imageSrc) => ({
  type: ADD_IMAGE,
  payload: imageSrc,
});
export const deleteImage = (index) => ({
  type: DELETE_IMAGE,
  payload: { index },
})
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: { loading },
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: { error },
});