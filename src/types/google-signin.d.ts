// src/types/google-signin.d.ts

declare module '@react-native-google-signin/google-signin' {
  export interface User {
    email: string;
    id: string;
    givenName?: string;
    familyName?: string;
    name?: string;
    photo?: string;
  }

  export interface UserInfo {
    user: User;
    idToken: string | null;
  }

  export interface SignInResponse {
    data?: UserInfo;
    user?: User;
    idToken?: string;
  }

  export interface ConfigureParams {
    webClientId?: string;
    offlineAccess?: boolean;
    hostedDomain?: string;
    forceCodeForRefreshToken?: boolean;
    accountName?: string;
    iosClientId?: string;
    googleServicePlistPath?: string;
    openIdRealm?: string;
    profileImageSize?: number;
  }

  export interface HasPlayServicesParams {
    showPlayServicesUpdateDialog?: boolean;
  }

  export const GoogleSignin: {
    configure(options: ConfigureParams): void;
    hasPlayServices(params?: HasPlayServicesParams): Promise<boolean>;
    signIn(): Promise<SignInResponse>;
    signOut(): Promise<void>;
    isSignedIn(): Promise<boolean>;
    getCurrentUser(): Promise<User | null>;
    getTokens(): Promise<{ idToken: string; accessToken: string }>;
    revokeAccess(): Promise<void>;
  };

  export const statusCodes: {
    SIGN_IN_CANCELLED: string;
    IN_PROGRESS: string;
    PLAY_SERVICES_NOT_AVAILABLE: string;
  };
}