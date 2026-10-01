"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("ShadowbannChecker contact form preview", {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-800" htmlFor="name">
          Name
        </label>
        <input
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
          id="name"
          name="name"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-800" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-800" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
          id="message"
          name="message"
          rows={6}
          required
        />
      </div>
      <button
        className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        type="submit"
      >
        Preview message
      </button>
      {submitted && (
        <p className="text-sm text-stone-600" role="status">
          This demo form does not send messages. Please email support@shadowbannchecker.vercel.app.
        </p>
      )}
    </form>
  );
}