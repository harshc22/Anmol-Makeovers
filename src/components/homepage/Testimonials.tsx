"use client";

import Image from "next/image";
import Slider from "react-slick";
import data from "@/data/testimonials.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Testimonial = {
  name: string;
  location?: string;
  message: string;
  img: string; // path under /public
};

const settings: import("react-slick").Settings = {
  dots: true,
  arrows: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 4500,
  pauseOnHover: true,
  swipeToSlide: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  responsive: [
    { breakpoint: 1024, settings: { arrows: false } }, // hide arrows on smaller screens if you like
  ],
};

export default function Testimonials() {
  const items = (data as { testimonial: Testimonial[] }).testimonial;

  return (
    <section className="bg-accent/30 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-8 text-center text-3xl font-serif text-dark sm:text-4xl">
          What Our Clients Say
        </h2>

        <Slider {...settings}>
          {items.map((tm, i) => (
            <aside key={i} className="px-2 sm:px-4">
              <div className="rounded-2xl border-2 border-primary bg-white p-8 text-center shadow-sm">
                {/* Quote mark */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 559.27 546.15"
                  className="mx-auto h-8 w-8 fill-[#FB6F92]"
                  aria-hidden="true"
                >
                  <path d="M336.63,250.54V33.44H553.71v217.1S587.7,503,364.37,512.71V392s85.76,35.63,74.55-141.49Z" />
                  <path d="M3.71,250.54V33.44H220.79v217.1S254.78,503,31.46,512.71V392S117.21,427.66,106,250.54Z" />
                </svg>

                <p className="mx-auto mt-6 mb-8 max-w-2xl text-balance text-base leading-relaxed text-dark">
                  {tm.message}
                </p>

                <Image
                  src={`/${tm.img}`}
                  alt={tm.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-3 rounded-full object-cover"
                />
                <h3 className="text-base font-semibold text-heading">
                  {tm.name}
                </h3>
                {tm.location && (
                  <div className="text-sm font-medium text-[#FB6F92]">{tm.location}</div>
                )}
              </div>
            </aside>
          ))}
        </Slider>
      </div>
    </section>
  );
}
