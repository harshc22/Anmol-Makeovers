import Services from "@/components/homepage/Services"
import Landing from "@/components/homepage/Landing"
import Testimonials from "@/components/homepage/TestimonialsSection"
import ContactPrompt from "@/components/homepage/Contact";

export default function Home() {
  return (
    <section>
      <Landing />
      <Services />
      <Testimonials />
      <ContactPrompt
          email="anmolbenipal2301@gmail.com"
          igHandle="anmolmakeovers_"
        />
    </section>
  );
}
