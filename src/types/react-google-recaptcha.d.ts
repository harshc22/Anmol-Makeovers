declare module 'react-google-recaptcha' {
  import { Component, RefObject } from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onError?: () => void;
    ref?: RefObject<ReCAPTCHA>;
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    reset(): void;
  }
}
