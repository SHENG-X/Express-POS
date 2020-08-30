
import createDataContext from './createDataContext';
import { 
  register,
  authenticate,
  tokenAuthenticate,
  createCategory,
  createProduct,
  updateStoreTax,
  deleteStoreProduct,
} from '../services';

const ACTIONS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT',
  ADD_PRODUCT: 'ADD_PRODUCT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_TAX: 'UPDATE_TAX',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT'
};

const userReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SIGN_IN:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_UP:
      return {...payload, authenticated: true};
    case ACTIONS.SIGN_OUT:
        return {};
    case ACTIONS.ADD_PRODUCT:
      return {...state, store: {...state.store, products: [...state.store.products, payload]}};
    case ACTIONS.ADD_CATEGORY:
      return {...state, store: {...state.store, categories: [...state.store.categories, payload]}};
    case ACTIONS.DELETE_PRODUCT:
      return {...state, store: {...state.store, products: state.store.products.filter(product => product._id !== payload)}};
    case ACTIONS.DELETE_CATEGORY:
      return {...state, store: {...state.store, categories: state.categories.filter(category => category._id !== payload)}};
    case ACTIONS.UPDATE_TAX:
      return {...state, store: {...state.store, tax: payload}};
    case ACTIONS.UPDATE_PRODUCT:
      const newProducts = state.store.products.map(prod => {
        if (prod._id === payload._id) {
          return payload;
        }
        return prod;
      });
      return {...state, store: {...state.store, products: newProducts}};
    default:
      return state;
  }
}

const signUp = (dispatch) => {
  return async ({ name, email, password }, callback) => {
    const response = await register(name, email, password);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_UP, payload: response.data});
      // save jtw token to local storage
      localStorage.setItem('EXPRESS-POS/token', response.data.token);
    }
    if (callback) {
      callback(response);
    }
  };
}

const signIn = (dispatch) => {
  return async ({ email, password }, callback) => {
    const response = await authenticate(email, password);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_IN, payload: response.data});
      // save jtw token to local storage
      localStorage.setItem('EXPRESS-POS/token', response.data.token);
    }
    if (callback) {
      callback(response);
    }
  };
}

const tokenAuth = (dispatch) => {
  return async (callback) => {
    const token = localStorage.getItem('EXPRESS-POS/token');
    const response = await tokenAuthenticate(token);
    if (response.status === 200) {
      dispatch({type: ACTIONS.SIGN_IN, payload: response.data});
      if (callback) {
        callback();
      }
    }
  }
}

const signOut = (dispatch) => {
  return (callback) => {
    localStorage.removeItem('EXPRESS-POS/token');
    dispatch({type: ACTIONS.SIGN_OUT});
    if (callback) {
      callback();
    }
  }
}

const addProduct = (dispatch) => {
  return (product) => {
    // TODO: save product to server side
    // on success add the product response
    product = {...product, _id: `${Math.round(Math.random() * 10000000000)}`};
    dispatch({type: ACTIONS.ADD_PRODUCT, payload: product});
  }
}

const deleteProduct = (dispatch) => {
  return async (product) => {
    const response = await deleteStoreProduct(product);
    if (response.status === 204) {
      dispatch({type: ACTIONS.DELETE_PRODUCT, payload: product._id});
    }
  }
}

const addCategory = (dispatch) => {
  return async (category, callback) => {
    const response = await createCategory(category);
    if (response.status === 201) {
      dispatch({type: ACTIONS.ADD_CATEGORY, payload: response.data});
    }
    if (callback) {
      callback(response);
    }
  }
}

const deleteCategory = (dispatch) => {
  return (pid) => {
    dispatch({type: ACTIONS.DELETE_CATEGORY, payload: pid});
  }
}

const updateTax = (dispatch) => {
  return async (tax) => {
    const response = await updateStoreTax(tax);
    if (response.status === 200) {
      dispatch({type: ACTIONS.UPDATE_TAX, payload: response.data});
    }
  }
}

const updateProduct = (dispatch) => {
  return (product) => {
    dispatch({type: ACTIONS.UPDATE_PRODUCT, payload: product});
  }
}

export const { Context, Provider } = createDataContext(
  userReducer,
  {
    signIn,
    signUp,
    signOut,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateTax,
    updateProduct,
    tokenAuth,
  },
  {}
);
