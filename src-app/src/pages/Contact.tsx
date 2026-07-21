import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, FileText, CheckCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons.tsx';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    setLoading(true);
    
    // Simulate API pipeline
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      reset();

      // Launch secure, clientside mailto link prefilled with validated inputs
      const mailtoUrl = `mailto:matomepontso@gmail.com?subject=${encodeURIComponent(
        data.subject
      )}&body=${encodeURIComponent(`From: ${data.name} <${data.email}>\n\n${data.message}`)}`;
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
        setSubmitted(false);
      }, 1500);
    }, 800);
  };

  const socialLinks = [
    {
      name: 'Email Direct',
      value: 'matomepontso@gmail.com',
      href: 'mailto:matomepontso@gmail.com',
      icon: <Mail className="text-[#2563EB]" size={20} />,
    },
    {
      name: 'LinkedIn Profile',
      value: 'linkedin.com/in/matomembowene',
      href: 'https://linkedin.com/in/matomembowene',
      icon: <LinkedinIcon className="text-[#2563EB]" size={20} />,
    },
    {
      name: 'GitHub Repositories',
      value: 'github.com/MatomeMb',
      href: 'https://github.com/MatomeMb',
      icon: <GithubIcon className="text-[#2563EB]" size={20} />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-[#1E293B] pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Get In Touch</h1>
        <p className="text-[#CBD5E1] text-sm">Hiring manager, engineering lead, or recruiter? Connect safely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <p className="text-[#CBD5E1] text-sm leading-relaxed font-light">
            I respond to emails and LinkedIn messages within 24 hours. Let's discuss backend optimization, AI integrations, or software engineering vacancies.
          </p>

          <div className="space-y-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-3 p-4 rounded-xl border border-[#1E293B] bg-[#0F172A] hover:border-[#2563EB]/30 hover:bg-[#111827] transition-all group focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <div className="w-10 h-10 rounded bg-[#111827] flex items-center justify-center border border-[#1E293B] group-hover:border-[#2563EB]/20 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase font-mono tracking-wider">
                    {link.name}
                  </span>
                  <span className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                    {link.value}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border border-[#1E293B] bg-[#111827]/30 p-6 rounded-2xl space-y-4 shadow-xl relative"
          >
            {submitted && (
              <div className="absolute inset-0 bg-[#0F172A]/95 rounded-2xl flex flex-col items-center justify-center gap-3 text-center z-10 animate-fadeIn">
                <CheckCircle className="text-[#22C55E]" size={48} />
                <h3 className="text-lg font-bold text-[#F8FAFC]">Message Form Validated</h3>
                <p className="text-xs text-[#CBD5E1] max-w-xs">
                  Launching your system email client...
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  {...register('name')}
                  className={`w-full px-4 py-2.5 text-sm bg-[#020617] border rounded-lg text-[#F8FAFC] placeholder-slate-600 focus:outline-none ${
                    errors.name ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E293B] focus:border-[#2563EB]'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-[#EF4444] font-mono">{errors.name.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  {...register('email')}
                  className={`w-full px-4 py-2.5 text-sm bg-[#020617] border rounded-lg text-[#F8FAFC] placeholder-slate-600 focus:outline-none ${
                    errors.email ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E293B] focus:border-[#2563EB]'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-[#EF4444] font-mono">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" class="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Software Engineering / System Optimization"
                {...register('subject')}
                className={`w-full px-4 py-2.5 text-sm bg-[#020617] border rounded-lg text-[#F8FAFC] placeholder-slate-600 focus:outline-none ${
                  errors.subject ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E293B] focus:border-[#2563EB]'
                }`}
              />
              {errors.subject && (
                <span className="text-xs text-[#EF4444] font-mono">{errors.subject.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Hi Matome, we reviewed your credentials..."
                {...register('message')}
                className={`w-full px-4 py-2.5 text-sm bg-[#020617] border rounded-lg text-[#F8FAFC] placeholder-slate-600 focus:outline-none resize-none ${
                  errors.message ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E293B] focus:border-[#2563EB]'
                }`}
              />
              {errors.message && (
                <span className="text-xs text-[#EF4444] font-mono">{errors.message.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
