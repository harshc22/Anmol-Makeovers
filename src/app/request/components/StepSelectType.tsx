"use client";
import type { MakeupType } from "../types";

interface Props {
  selected: MakeupType | null;
  setSelected: (m: MakeupType) => void;
  onNext: () => void;
}

export default function StepSelectType({
  selected,
  setSelected,
  onNext,
}: Props) {
  return (
    <>
      <h1 className="text-5xl font-serif text-heading mb-4 text-center">
        Request a Quote
      </h1>
      <p className="text-dark text-center mb-8 text-base">
        What kind of makeup are you booking?
      </p>

      <div className="space-y-4">
        {(["Bridal", "Non-Bridal"] as MakeupType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            className={`w-full py-4 rounded-md border text-lg font-medium transition ${
              selected === type
                ? "bg-accent text-dark border-primary"
                : "bg-background text-dark border-gray hover:bg-accent"
            }`}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={onNext}
          disabled={!selected}
          className={`w-full py-3 text-lg rounded-md transition shadow ${
            selected
              ? "bg-primary hover:bg-primaryHover text-light"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
