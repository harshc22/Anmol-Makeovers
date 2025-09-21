"use client";

interface Props {
  eventCount: number;
  setEventCount: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function StepNonBridalCount({
  eventCount,
  setEventCount,
  onBack,
  onNext,
}: Props) {
  return (
    <>
      <div className="transition-opacity duration-300 ease-in-out">
        <h2 className="text-4xl font-serif text-heading mb-4 text-center">
          Event Details
        </h2>
        <p className="text-dark text-center mb-6 text-base">
          How many events are you booking for?
        </p>

        <select
          value={eventCount}
          onChange={(e) => setEventCount(Number(e.target.value))}
          className="w-full text-dark transition-colors"
        >
          {([1, 2, 3, 4, 5] as const).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onBack}
            className="w-1/2 text-lg border border-primary text-primary hover:bg-accent"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="w-1/2 text-lg shadow bg-primary hover:bg-primaryHover text-light"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
