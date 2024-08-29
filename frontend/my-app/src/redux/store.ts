import { configureStore } from '@reduxjs/toolkit'
import user from '@/redux/slices/userSlice';
import deeds from '@/redux/slices/deedsSlice';
import account from '@/redux/slices/accountSlice';

export const store = configureStore({
   reducer: {
     user: user,
     deeds: deeds,
     accountUser: account,
   }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch