"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const defaultImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=720&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=720&q=80",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=720&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=720&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=720&q=80",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=720&q=80",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=720&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=720&q=80",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=720&q=80",
];

type Props = {
  images?: string[];
  defaultExpanded?: number;
  videoIndex?: number;
  videoUrl?: string;
};

const ExpandOnHover = ({ images = defaultImages, defaultExpanded = 3, videoIndex, videoUrl }: Props) => {
  const [expandedImage, setExpandedImage] = useState(defaultExpanded);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Autoplay when section scrolls into view
  useEffect(() => {
    if (videoIndex === undefined || !videoUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = videoRef.current;
          if (!v) return;
          if (entry.isIntersecting) {
            v.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            v.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }, // trigger when 50% of the section is visible
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [videoIndex, videoUrl]);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnded = () => setIsPlaying(false);

  const isVideo = (idx: number) => videoIndex === idx && videoUrl;

  return (
    <div className="w-full bg-[#f5f4f3]" ref={sectionRef}>
      <div className="relative flex w-full items-center justify-center p-2">
        <div className="w-full overflow-hidden rounded-3xl">
          <div className="flex w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
            <div className="relative w-full max-w-6xl px-5">
              <div className="flex w-full items-center justify-center gap-1">
                {images.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative hidden cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out md:block"
                    style={{
                      width: getImageWidth(idx + 1),
                      height: "24rem",
                    }}
                    onMouseEnter={() => setExpandedImage(idx + 1)}
                    onClick={isVideo(idx) ? toggleVideo : undefined}
                  >
                    {isVideo(idx) ? (
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                        onEnded={handleVideoEnded}
                        poster={src}
                      />
                    ) : (
                      <img
                        className="h-full w-full object-cover"
                        src={src}
                        alt={`Look ${idx + 1}`}
                        loading="lazy"
                      />
                    )}
                    {isVideo(idx) && !isPlaying && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                          <Play className="ml-0.5 h-5 w-5 text-white" fill="white" />
                        </div>
                      </div>
                    )}
                    {isVideo(idx) && isPlaying && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                          <Pause className="h-5 w-5 text-white" fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Mobile fallback: horizontal scroll */}
                <div className="flex w-full gap-2 overflow-x-auto md:hidden">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative flex-shrink-0"
                      onClick={isVideo(idx) ? toggleVideo : undefined}
                    >
                      {isVideo(idx) ? (
                        <video
                          ref={idx === videoIndex ? videoRef : undefined}
                          src={videoUrl}
                          className="h-72 w-56 flex-shrink-0 rounded-2xl object-cover"
                          muted
                          loop
                          playsInline
                          onEnded={handleVideoEnded}
                          poster={src}
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`Look ${idx + 1}`}
                          loading="lazy"
                          className="h-72 w-56 flex-shrink-0 rounded-2xl object-cover"
                        />
                      )}
                      {isVideo(idx) && !isPlaying && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                            <Play className="ml-0.5 h-5 w-5 text-white" fill="white" />
                          </div>
                        </div>
                      )}
                      {isVideo(idx) && isPlaying && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                            <Pause className="h-5 w-5 text-white" fill="white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandOnHover;
