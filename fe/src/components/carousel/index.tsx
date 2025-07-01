"use client";

import { Carousel } from "antd";
import Image from "next/image";

const App: React.FC = () => (
  <Carousel
    arrows
    infinite={true}
    autoplay={{ dotDuration: true }}
    autoplaySpeed={2000}
  >
    <div>
      <Image
        src="/images/home_slider_1.webp"
        alt="Image 1"
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
    <div>
      <Image
        src="/images/home_slider_1.webp"
        alt="Image 1"
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
    <div>
      <Image
        src="/images/home_slider_1.webp"
        alt="Image 1"
        width={800}
        height={400}
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  </Carousel>
);

export default App;
