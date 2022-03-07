import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { googleLoginStateProps, initialLoginStateProps } from './initialStates';
import { Product } from '../C_props';
import { store } from './store';

// Define RootState : 1) Login 2) User 3) Product
// Use this RootState for useSelector hook. 
// Method 1 
export interface RootState  {
    login : initialLoginStateProps
    cart : Product[]
    googleOauthLogin : googleLoginStateProps
}

// method 2
// export type RootState = ReturnType<typeof store.getState> 
export type AppDispatch = typeof store.dispatch

// type casting for redux selector & dispatch
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()