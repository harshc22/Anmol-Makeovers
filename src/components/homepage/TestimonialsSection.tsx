import Testimonials from "@/components/homepage/Testimonials";
import { getTestimonials } from "@/lib/testimonials/route";
export default async function TestimonialsSection() {
  const items = await getTestimonials();
  return <Testimonials title="TESTIMONIALS" items={items} autoplayMs={4500} />;
}
