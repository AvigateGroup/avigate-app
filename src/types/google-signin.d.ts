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

  export interface SignInResponse {
    data?: {
      user: User;
      idToken?: string;
    };
    user?: User;
    idToken?: string;
  }

  export const GoogleSignin: {
    configure(options: any): void;
    hasPlayServices(): Promise<boolean>;
    signIn(): Promise<SignInResponse>;
    signOut(): Promise<void>;
  };

  export const statusCodes: {
    SIGN_IN_CANCELLED: string;
    IN_PROGRESS: string;
    PLAY_SERVICES_NOT_AVAILABLE: string;
  };
}
