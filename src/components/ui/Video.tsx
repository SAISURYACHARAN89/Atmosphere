import { useEffect, useRef, useState } from "react";
import { LuVolume2, LuVolumeX, LuPlay, LuPause } from "react-icons/lu";

type VideoProps = {
  src: string;
  isReel?: boolean;
};

export const Video = ({ src, isReel = false }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
        } else if (video.paused) {
          video.play().catch(() => {});
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setShowIndicator(true);

      // hide after playing
      setTimeout(() => setShowIndicator(false), 700);
    } else {
      video.pause();
      setShowIndicator(true); // keep visible while paused
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className={`relative w-full ${isReel ? "h-full" : "aspect-[16/9]"}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        loop
        autoPlay
        muted={muted}
        playsInline
        onClick={togglePlay}
      />

      {/* Center Play/Pause indicator */}
      {showIndicator && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 p-4 rounded-full text-white">
            {isPlaying ? <LuPause size={36} /> : <LuPlay size={36} />}
          </div>
        </div>
      )}

      {/* Volume Button */}
      {(!isReel || !isPlaying) && (
        <button
          onClick={toggleMute}
          className={`absolute bg-black/50 text-white p-2 rounded-full ${
            isReel
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-[250%]"
              : "bottom-3 right-3"
          }`}
        >
          {muted ? <LuVolumeX size={18} /> : <LuVolume2 size={18} />}
        </button>
      )}
    </div>
  );
};

export default Video;
