import React from "react";
import { Carousel } from "antd";
import Image from "next/image";
import resolveImageSrc from "@/utils/resolveImageSrc";

export interface Banner {
  id: string;
  sort: number;
  title: string;
  image: string;
}

interface CarouselProps {
  carouselData?: any;
}

const App: React.FC<CarouselProps> = ({ carouselData }) => {
  const images: Banner[] = Array.isArray(carouselData?.banners?.images)
    ? carouselData.banners.images
    : Array.isArray(carouselData?.banners)
    ? (carouselData.banners as Banner[])
    : [];
  return (
    <Carousel
      arrows
      infinite={true}
      autoplay={{ dotDuration: true }}
      autoplaySpeed={2000}
    >
      {images
        .map((image: Banner) => ({
          ...image,
          resolvedSrc: resolveImageSrc(image.image),
        }))
        .filter((img) => Boolean(img.resolvedSrc))
        .map((image: Banner & { resolvedSrc?: string }, index: number) => (
          <div key={image.id ?? image.sort}>
            <Image
              src={image.resolvedSrc as string}
              alt={image.title || "Carousel image"}
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto", maxHeight: "686px" }}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default App;
