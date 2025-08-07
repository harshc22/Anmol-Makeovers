'use client'

import { useState, useEffect, useRef } from 'react'

export default function RequestQuote() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<'Bridal' | 'Non-Bridal' | null>(null)
  const [eventCount, setEventCount] = useState(1)
  const [events, setEvents] = useState([
    { eventType: '', date: '', time: '', location: '', people: '', services: [] as string[] },
  ])

  const today = new Date().toISOString().split('T')[0]

  const handleStart = () => {
    if (!selected) return
    setStep(2)
  }

  const handleEventsInit = () => {
    setEvents(
      Array.from({ length: eventCount }, () => ({
        eventType: '',
        date: '',
        time: '',
        location: '',
        people: '',
        services: []
      }))
    )
    setStep(3)
  }

    type EventField = 'eventType' | 'date' | 'time' | 'location' | 'people'

    const handleEventChange = (
    index: number,
    field: EventField,
    value: string
    ) => {
    const updatedEvents = [...events]
    updatedEvents[index][field] = value
    setEvents(updatedEvents)
    }


  const handleServiceToggle = (index: number, service: string) => {
    const updatedEvents = [...events]
    const currentServices = updatedEvents[index].services
    updatedEvents[index].services = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service]
    setEvents(updatedEvents)
  }

  const renderStep1 = () => (
    <>
      <h1 className="text-5xl font-serif text-heading mb-4 text-center">Request a Quote</h1>
      <p className="text-dark text-center mb-8 text-base">
        What kind of makeup are you booking?
      </p>
      <div className="space-y-4">
        {['Bridal', 'Non-Bridal'].map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type as 'Bridal' | 'Non-Bridal')}
            className={`w-full py-4 rounded-md border text-lg font-medium transition ${
              selected === type
                ? 'bg-accent text-dark border-gray'
                : 'bg-background text-dark border-gray hover:bg-accent'
            }`}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={handleStart}
          disabled={!selected}
          className={`w-full py-3 text-lg rounded-md transition shadow ${
            selected
              ? 'bg-primary hover:bg-primaryHover text-light'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </>
  )

  const renderStep2NonBridal = () => (
    <>
      <div className="transition-opacity duration-300 ease-in-out">
        <h2 className="text-4xl font-serif text-heading mb-4 text-center">Event Details</h2>
        <p className="text-dark text-center mb-6 text-base">
          How many events are you booking for?
        </p>
        <input
          type="number"
          min={1}
          max={5}
          value={eventCount}
          onChange={(e) => setEventCount(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray rounded-md text-dark"
        />
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={() => setStep(1)}
            className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
          >
            Back
          </button>
          <button
            onClick={handleEventsInit}
            className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )

  const renderEventForms = () => (
    <>
      <h2 className="text-4xl font-serif text-heading mb-4 text-center">Tell us about each event</h2>
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="border border-gray rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-heading">Event {index + 1}</h3>
            <input
              type="text"
              placeholder="Event Type (e.g. Party, Photoshoot)"
              className="w-full px-4 py-3 border border-gray rounded-md"
              value={event.eventType}
              onChange={(e) => handleEventChange(index, 'eventType', e.target.value)}
            />
            <label className="block text-sm font-medium text-heading mb-2">
                Event Date
            </label>
            <input
              type="date"
              min={today}
              className="w-full px-4 py-3 border border-gray rounded-md"
              value={event.date}
              onChange={(e) => handleEventChange(index, 'date', e.target.value)}
            />
            <label className="block text-sm font-medium text-heading mb-2">
                Ready Time
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-gray rounded-md"
              value={event.time}
              onChange={(e) => handleEventChange(index, 'time', e.target.value)}
            />
            <input
              type="number"
              min={1}
              max={10}
              placeholder="Number of People"
              className="w-full px-4 py-3 border border-gray rounded-md"
              value={event.people}
              onChange={(e) => handleEventChange(index, 'people', e.target.value)}
            />
            <div>
            <label className="block text-sm font-medium text-heading mb-2">
                Services <span className="text-sm text-gray-500">(you can choose both)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
                {['Makeup', 'Hair'].map((service) => {
                const selected = event.services.includes(service)
                return (
                    <label
                    key={service}
                    className={`flex items-center justify-center rounded-md border text-lg font-medium py-3 cursor-pointer transition-all duration-200
                        ${selected
                        ? 'bg-accent text-dark border-primary shadow-md'
                        : 'bg-background text-dark border-gray hover:bg-accent'}
                    `}
                    >
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selected}
                        onChange={() => handleServiceToggle(index, service)}
                    />
                    {service}
                    </label>
                )
                })}
            </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => console.log('Final form data:', events)}
        className="mt-8 w-full py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
      >
        Submit
      </button>
    </>
  )

  return (
    <section className="bg-background pt-20 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-gray space-y-8">
        {step === 1 && renderStep1()}
        {step === 2 && selected === 'Non-Bridal' && renderStep2NonBridal()}
        {step === 3 && selected === 'Non-Bridal' && renderEventForms()}
        {/* Bridal form will go here in future */}
      </div>
    </section>
  )
}
