'use client'

import { useState, useEffect, useRef } from 'react'
import { getGoogleLoader } from './loaderSingleton'

export default function RequestQuote() {

    const [step, setStep] = useState(1)
    const [selected, setSelected] = useState<'Bridal' | 'Non-Bridal' | null>(null)
    const [eventCount, setEventCount] = useState(1)
    const [events, setEvents] = useState([
        { eventType: '', date: '', time: '', location: '', people: '', services: [] as string[] },
    ])
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        address: '',
    })


    const today = new Date().toISOString().split('T')[0]

    const handleStart = () => {
        if (!selected) return
        setStep(2)
    }

    const [eventError, setEventError] = useState<string | null>(null)
    const handleContactChange = (field: keyof typeof contactInfo, value: string) => {
        setContactInfo({ ...contactInfo, [field]: value })
    }

    const addressInputRef = useRef<HTMLInputElement | null>(null)
    const sessionTokenRef = { current: null as google.maps.places.AutocompleteSessionToken | null };
    
    useEffect(() => {
    if (step !== 4) return;

    let listener: google.maps.MapsEventListener | null = null;
    let autocomplete: google.maps.places.Autocomplete | null = null;

    getGoogleLoader().load().then(() => {
        if (!addressInputRef.current) return;

        // start a fresh session when user focuses the field
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

        autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: 'ca' },
        // ask ONLY for what you need
        fields: ['formatted_address'], // drop 'geometry' if not needed
        types: ['address'],
        });

        // attach the token to the widget predictions
        // @ts-ignore (supported at runtime)
        autocomplete.setOptions({ sessionToken: sessionTokenRef.current });

        listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete!.getPlace();
        if (place.formatted_address) {
            setContactInfo(prev => ({ ...prev, address: place.formatted_address }));
        }
        // end the session after a selection; new focus will create a new token
        sessionTokenRef.current = null;
        });
    });

    return () => {
        if (listener) listener.remove();
    };
    }, [step]);


    const handleEventsInit = () => {
        if (eventCount < 1 || eventCount > 5) {
            setEventError('Please enter a number between 1 and 5.')
            return
        }

        setEventError(null)
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
                        className={`w-full py-4 rounded-md border text-lg font-medium transition ${selected === type
                                ? 'bg-accent text-dark border-primary'
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
                    className={`w-full py-3 text-lg rounded-md transition shadow ${selected
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
                <select
                value={eventCount}
                onChange={(e) => setEventCount(Number(e.target.value))}
                className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base
                    focus:outline-none focus:ring-2 ring-primary focus:border-primary transition"
                >
                <option value="" disabled>
                    Select number of events
                </option>
                {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                    {num}
                    </option>
                ))}
                </select>

                <div className="mt-6 flex justify-between gap-4">
                    <button
                        onClick={() => setStep(1)}
                        className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition focus:border-primary focus:ring-primary"
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
                        <label className="block text-sm font-medium text-heading mb-2">
                        Number of People
                        </label>
                        <select
                        value={event.people}
                        onChange={(e) => handleEventChange(index, 'people', e.target.value)}
                        className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base
                            focus:outline-none focus:border-primary transition"
                        >
                        <option value="" disabled>
                            Select number of people
                        </option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                            {i + 1}
                            </option>
                        ))}
                        </select>

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
            <div className="mt-6 flex justify-between gap-4">
                <button
                    onClick={() => setStep(2)}
                    className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
                >
                    Back
                </button>
                <button
                    onClick={() => {
                        // Check if all event fields are filled
                        const allFilled = events.every(ev =>
                            ev.eventType.trim() &&
                            ev.date.trim() &&
                            ev.time.trim() &&
                            ev.people &&
                            ev.services.length > 0
                        );

                        if (!allFilled) {
                            alert("Please fill all fields for each event before continuing.");
                            return;
                        }
                        setStep(4);
                    }}

                    className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
                >
                    Next
                </button>
            </div>
        </>
    )

    const renderContactForm = () => (
        <>
            <h2 className="text-3xl sm:text-4xl font-serif text-heading mb-4 text-center">
            Contact Info
            </h2>
            <p className="text-dark text-center mb-6 text-base">
            We’ll use this info to follow up with your quote.
            </p>

            <div className="space-y-4">
            <input
                type="email"
                placeholder="Email Address"
                value={contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
            />
            <input
                type="tel"
                placeholder="Phone Number"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
            />
            <input
                type="text"
                placeholder="Street Address"
                ref={addressInputRef}
                value={contactInfo.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                className="w-full px-4 py-4 rounded-md border border-gray bg-background text-dark text-base focus:outline-none focus:border-primary transition"
            />
            </div>

            <div className="mt-6 flex justify-between gap-4">
            <button
                onClick={() => setStep(3)}
                className="w-1/2 py-3 text-lg rounded-md border border-primary text-primary hover:bg-accent transition"
            >
                Back
            </button>
            <button
                onClick={() => handleSubmitForm()}
                className="w-1/2 py-3 text-lg rounded-md transition shadow bg-primary hover:bg-primaryHover text-light"
            >
                Submit
            </button>
            </div>
        </>
    )

    const handleSubmitForm = async () => {
        const payload = {
            type: selected,
            events,
            contactInfo
        }

        try {
            const res = await fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
            })

            if (res.ok) {
            alert('Your request has been sent! You will receive a confirmation shortly.')
            // optionally reset or redirect
            } else {
            alert('Something went wrong. Please try again.')
            }
        } catch (err) {
            console.error(err)
            alert('Server error. Please try again later.')
        }
    }

    return (
        <section className="bg-background pt-25 min-h-screen flex items-center justify-center px-4 py-16">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-lg w-full border border-gray space-y-8">
                {step === 1 && renderStep1()}
                {step === 2 && selected === 'Non-Bridal' && renderStep2NonBridal()}
                {step === 3 && selected === 'Non-Bridal' && renderEventForms()}
                {step === 4 && renderContactForm()}
                
                {/* Bridal form will go here in future */}
            </div>
        </section>
    )
}
