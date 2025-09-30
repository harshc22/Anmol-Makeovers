import Testimonials from "@/components/homepage/Testimonials";
import { getTestimonials } from "@/lib/testimonials/route";
export default async function TestimonialsSection() {
  let items = await getTestimonials();
  return <Testimonials title="CLIENT LOVE" items={items} autoplayMs={4500} />;
}
