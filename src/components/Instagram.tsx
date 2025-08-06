'use client'

import { useEffect } from 'react'

export default function InstagramFeed() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <section className="bg-background py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-semibold mb-6 text-heading">Follow on Instagram</h2>
        <p className="text-lg mb-10 text-dark">
          See more beauty transformations, BTS, and client moments.
        </p>

        <iframe
          src="//lightwidget.com/widgets/bea7204f7cae520b9fd627fb1edd0f42.html"
          scrolling="no"
          allowTransparency={true}
          className="w-full border-none overflow-hidden lightwidget-widget"
          style={{ height: '600px' }}
        ></iframe>
      </div>
    </section>
  )
}
