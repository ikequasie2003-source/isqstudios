"use client";

import { useState } from "react";

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

type Props = { images?: string[]; defaultExpanded?: number };

const ExpandOnHover = ({ images = defaultImages, defaultExpanded = 3 }: Props) => {
  const [expandedImage, setExpandedImage] = useState(defaultExpanded);

  const getImageWidth = (index: number) =>
    index === expandedImage ? "24rem" : "5rem";

  return (
    <div className="w-full bg-[#f5f4f3]">
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
                  >
                    <img
                      className="h-full w-full object-cover"
                      src={src}
                      alt={`Look ${idx + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}
                {/* Mobile fallback: horizontal scroll */}
                <div className="flex w-full gap-2 overflow-x-auto md:hidden">
                  {images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Look ${idx + 1}`}
                      loading="lazy"
                      className="h-72 w-56 flex-shrink-0 rounded-2xl object-cover"
                    />
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
