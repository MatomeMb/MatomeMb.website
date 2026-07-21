import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowUpRight, CheckCircle2, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/SocialIcons.tsx";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(4, "Subject must be at least 4 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const channels = [
  {
    label: "Email",
    value: "matomepontso@gmail.com",
    href: "mailto:matomepontso@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/matomembowene",
    href: "https://linkedin.com/in/matomembowene",
    icon: LinkedinIcon,
  },
  {
    label: "GitHub",
    value: "github.com/MatomeMb",
    href: "https://github.com/MatomeMb",
    icon: GithubIcon,
  },
];

export default function Contact() {
  const [launched, setLaunched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data: ContactFormValues) => {
    const mailto = `mailto:matomepontso@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${data.subject}`
    )}&body=${encodeURIComponent(`From: ${data.name} <${data.email}>\n\n${data.message}`)}`;
    window.location.href = mailto;
    setLaunched(true);
    reset();
  };

  return (
    <div className="space-y-10 py-14">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact</h1>
        <p className="leading-relaxed text-gray-600">
          The fastest route is email. I reply to engineering-role enquiries, technical questions and
          collaboration proposals — typically within one working day.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Direct channels */}
        <div className="space-y-6">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={15} className="text-gray-400" aria-hidden="true" />
            Johannesburg, South Africa — open to relocation
          </p>
          <ul className="divide-y divide-gray-100 border-y border-gray-100">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="flex items-center gap-3">
                    <channel.icon size={17} className="text-gray-400" aria-hidden="true" />
                    <span>
                      <span className="block text-xs font-medium text-gray-500">{channel.label}</span>
                      <span className="block text-sm font-semibold text-gray-900">
                        {channel.value}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-gray-300 transition-colors group-hover:text-blue-600"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="resume.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none"
          >
            Download Resume
          </a>
        </div>

        {/* Validated form — composes a mailto: against the local client */}
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-6"
            aria-label="Contact form"
          >
            <p className="text-sm leading-relaxed text-gray-600">
              Prefer a form? It validates below, then opens your own email client with the message
              pre-filled — nothing is sent to, or stored on, any server.
            </p>

            {launched && (
              <p
                role="status"
                className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                Your email client should now be open with the drafted message.
              </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                    errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-600"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300 focus:border-blue-600"
                  }`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-sm font-medium text-gray-900">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                {...register("subject")}
                className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                  errors.subject ? "border-red-500" : "border-gray-300 focus:border-blue-600"
                }`}
                placeholder="Backend engineer role / technical question"
              />
              {errors.subject && (
                <p id="subject-error" role="alert" className="text-xs text-red-600">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium text-gray-900">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                {...register("message")}
                className={`w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none ${
                  errors.message ? "border-red-500" : "border-gray-300 focus:border-blue-600"
                }`}
                placeholder="Hi Matome — I came across your work on..."
              />
              {errors.message && (
                <p id="message-error" role="alert" className="text-xs text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none disabled:opacity-50"
            >
              Compose email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
