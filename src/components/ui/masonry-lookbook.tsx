interface MasonryLookbookProps {
  images: string[];
}

export function MasonryLookbook({ images }: MasonryLookbookProps) {
  return (
    <div className="columns-2 gap-1 md:columns-3 lg:columns-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="relative mb-1 overflow-hidden break-inside-avoid group"
        >
          <img
            src={src}
            alt={`Lookbook ${i + 1}`}
            loading="lazy"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Subtle gold overlay on hover */}
          <div className="absolute inset-0 bg-[#C9A227]/0 transition-colors duration-500 group-hover:bg-[#C9A227]/10" />
        </div>
      ))}
    </div>
  );
}
