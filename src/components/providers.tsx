"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistor, store } from '@/store';
import { Toaster } from "sonner";

const CLIENT_ID = '377070938930-rdbim8psfveic49hu2flba1gc4s3genp.apps.googleusercontent.com';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster />
          {children}
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
