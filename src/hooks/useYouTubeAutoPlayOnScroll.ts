// src/hooks/useYouTubeAutoPlayOnScroll.ts

import { useEffect } from "react";

interface YouTubePlayerItem {
  iframe: HTMLIFrameElement;
  player: YT.Player;
  ready: boolean;
}

export function useYouTubeAutoPlayOnScroll(selector: string) {
  useEffect(() => {
    let players: YouTubePlayerItem[] = [];
    let observer: IntersectionObserver | null = null;

    function setupPlayers() {
      const iframes = document.querySelectorAll<HTMLIFrameElement>(selector);

      iframes.forEach((iframe) => {
        const item: YouTubePlayerItem = {
          iframe,
          player: null as any,
          ready: false
        };

        const player = new window.YT.Player(iframe, {
          events: {
            onReady: () => {
              item.ready = true;
              item.player.mute();
            }
          }
        });

        item.player = player;
        players.push(item);
      });

      observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const item = players.find((p) => p.iframe === entry.target);
      if (!item || !item.ready) return;

      if (entry.isIntersecting) {
        item.player.seekTo(0, true);
        item.player.playVideo();
      } else {
        item.player.pauseVideo();
      }
    });
  },
  { threshold: 0.5 }
);


      players.forEach((p) => observer!.observe(p.iframe));
    }

    // Load the YouTube API script only once
    if (!document.getElementById("youtube-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // When API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      setupPlayers();
    };

    // If API already ready
    if (window.YT && window.YT.Player) {
      setupPlayers();
    }

    return () => observer?.disconnect();
  }, [selector]);
}
