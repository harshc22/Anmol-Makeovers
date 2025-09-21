"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail, Phone, Clock } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the service type from URL params if available
  const serviceType = searchParams.get("type") || "service";

  const handleGoHome = () => {
    router.push("/");
  };

  const handleNewRequest = () => {
    router.push("/request");
  };

  return (
    <section className="bg-background pt-25 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-8 md:p-12 text-center border border-gray">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-accent rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-heading mb-4">
          Request Submitted Successfully!
        </h1>
        
        <p className="text-lg text-dark mb-8 leading-relaxed">
          Thank you for your interest in our {serviceType.toLowerCase()} services. 
          We&apos;ve received your quote request and will get back to you within 24 hours.
        </p>

        {/* What's Next Section */}
        <div className="bg-accent rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-heading mb-4">What happens next?</h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <Mail className="w-4 h-4 text-light" />
              </div>
              <div>
                <p className="font-medium text-heading">Email Confirmation</p>
                <p className="text-sm text-dark">You&apos;ll receive a confirmation email shortly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <Clock className="w-4 h-4 text-light" />
              </div>
              <div>
                <p className="font-medium text-heading">Review & Quote</p>
                <p className="text-sm text-dark">We&apos;ll review your requirements and prepare a detailed quote</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <Phone className="w-4 h-4 text-light" />
              </div>
              <div>
                <p className="font-medium text-heading">Personal Contact</p>
                <p className="text-sm text-dark">We&apos;ll reach out to discuss your event and finalize details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-accent rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-heading mb-2">Need immediate assistance?</h3>
          <p className="text-sm text-dark">
            Feel free to contact us directly if you have any urgent questions about your booking.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNewRequest}
            className="bg-primary text-light font-semibold py-3 px-8 rounded-md hover:bg-primaryHover transition"
          >
            Submit Another Request
          </button>
          <button
            onClick={handleGoHome}
            className="border-2 border-primary text-dark px-8 py-3 rounded-md hover:bg-accent transition"
          >
            Return to Home
          </button>
        </div>

      </div>
    </section>
  );
}
