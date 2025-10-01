"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle} from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
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
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-heading mb-4">
          Request Submitted Successfully!
        </h1>
        
        <p className="text-lg text-dark mb-8 leading-relaxed">
          Thank you for your interest in our {serviceType.toLowerCase()} services. 
          We&apos;ve received your quote request and will get back to you within 24 hours.
        </p>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNewRequest}
            className="flex-1 min-w-[200px] border-2 border-primary text-dark px-8 py-3 rounded-full hover:bg-accent transition"
          >
            Submit Another Request
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 min-w-[200px] bg-primary text-light font-semibold py-3 px-8 rounded-full hover:bg-primaryHover transition"
          >
            Return to Home
          </button>
        </div>

      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <section className="bg-background pt-25 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-8 md:p-12 text-center border border-gray">
          <div className="animate-pulse">
            <div className="bg-accent rounded-full p-6 w-16 h-16 mx-auto mb-8"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-gray-200 rounded w-48"></div>
              <div className="h-12 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </section>
    }>
      <SuccessContent />
    </Suspense>
  );
}
