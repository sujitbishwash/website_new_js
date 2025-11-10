declare namespace YT {
  class Player {
    constructor(element: HTMLElement | string, options: any);
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    mute(): void;       // ✅ Add this
    unMute(): void;     // ✅ Add this (optional)
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
