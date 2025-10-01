import Services from "@/components/homepage/Services"
import Landing from "@/components/homepage/Landing"
import Testimonials from "@/components/homepage/TestimonialsSection"

export default function Home() {
  return (
    <section>
      <Landing />
      <Services />
      <Testimonials />
    </section>
  );
}
