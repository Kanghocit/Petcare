import { getAllBanners } from "@/libs/carousel";
import { Carousel } from "antd";
import Image from "next/image";
import resolveImageSrc from "@/utils/resolveImageSrc";
export interface Banner {
  id: string;
  sort: number;
  title: string;
  image: string;
}
const App: React.FC = async () => {
  const carouselData = await getAllBanners();
  console.log("data", carouselData);
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
        .map((image: Banner & { resolvedSrc?: string }) => (
          <div key={image.id ?? image.sort}>
            <Image
              src={image.resolvedSrc as string}
              alt={image.title || "Carousel image"}
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ width: "100%", height: "auto", maxHeight: "686px" }}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default App;
