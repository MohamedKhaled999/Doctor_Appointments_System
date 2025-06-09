// src/mixitup.d.ts
declare module 'mixitup' {
  export interface Mixer {
    filter(selector: string): void;
    sort(sortString: string): void;
    destroy(): void;
    [key: string]: any;
  }

  export interface MixItUpOptions {
    animation?: {
      effects?: string;
      duration?: number;
    };
    selectors?: {
      target?: string;
    };
    [key: string]: any;
  }

  function mixitup(container: Element | string, config?: MixItUpOptions): Mixer;

  export default mixitup;
}
