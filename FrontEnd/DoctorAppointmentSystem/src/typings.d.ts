declare module '@dotlottie/player-component' {
    class DotLottiePlayer extends HTMLElement {
      src: string;
      speed: number;
      loop: boolean;
      autoplay: boolean;
      play(): void;
      pause(): void;
      stop(): void;
    }
  }