import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f7eeea] text-gray-800 px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Left */}
          <div>
            <h1 className="text-7xl font-serif font-semibold mb-6 leading-tight">
              Enhancing Your Natural Beauty
            </h1>
            <p className="text-xl mb-6">
              Hi, I’m Anmol, a certified makeup artist specializing in creating
              beautiful, personalized looks for any occasion.
            </p>
            <div className="flex gap-4">
              <a
                href="/portfolio"
                className="border-2 border-[#cf988b] text-gray px-6 py-3 rounded-md hover:bg-[#F7E7E3]"
              >
                View Portfolio
              </a>
              <a
                href="/booking"
                className="bg-[#cf988b] text-white px-6 py-3 rounded-md hover:bg-[#BB8378]"
              >
                Book Now
              </a>
            </div>
          </div>

          {/* Image Right */}
          <div className="flex justify-center">
            <Image
              src="/images/hero-model.jpg"
              alt="Makeup model"
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}
