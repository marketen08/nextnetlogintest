// msalConfig.ts

import { Configuration, PublicClientApplication, PopupRequest } from "@azure/msal-browser";

// Configuración de MSAL
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!,
    authority: "https://login.microsoftonline.com/0f276254-90c1-46c0-b39f-3e643337c5f5/v2.0",
    redirectUri: process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI!, // referencia desde env
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Parámetros de solicitud de login
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};

// Instancia global de MSAL
export const msalInstance = new PublicClientApplication(msalConfig);

// ⚠️ Agrega esta función para inicializar
export async function initializeMsal() {
  await msalInstance.initialize();
}

// Función para iniciar sesión
export async function microsoftLogin() {
  try {
    await initializeMsal(); // 🧠 Asegurarse que esté inicializado
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    return {
      accessToken: loginResponse.accessToken,
      idToken: loginResponse.idToken,
      account: loginResponse.account,
    };
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    throw error;
  }
}
