import Image from 'next/image'

export default function BookingHero() {
  return (
    <section className="relative bg-background text-dark min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 pt-36 pb-16 overflow-hidden">

      {/* Left Column: Bigger SVG Art */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4">
        <div className="w-[300px] sm:w-[380px] md:w-[520px] lg:w-[600px]">
          <Image
            src="/images/makeup-art.svg"
            alt="Makeup Illustration"
            width={600}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Column: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start px-4 mt-10 md:mt-0 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-heading">
          Let&apos;s Create Your Perfect Look
        </h1>
        <p className="text-lg max-w-md text-dark">
          From bridal elegance to editorial glam, every look is crafted with care, confidence, and intention.
        </p>
        <a
          href="/request"
          className="inline-block bg-primary text-light text-lg px-8 py-4 rounded-full shadow-md hover:bg-primaryHover transition"
        >
          Request a Quote
        </a>
      </div>
      
    </section>
  )
}
