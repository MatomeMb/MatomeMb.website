import React from 'react';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
        <Shield className="text-[#2563EB]" size={28} />
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Privacy Policy</h1>
      </div>
      
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 space-y-4 text-sm text-[#CBD5E1] leading-relaxed">
        <p>
          This website is built with strict privacy-by-design standards:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Zero Tracking:</strong> No cookies, analytics pixels, or telemetry collectors are loaded or executed.</li>
          <li><strong>Zero Logging:</strong> No personal details, IP logs, or conversation logs are stored on any database.</li>
          <li><strong>Grounded Local Chatbot:</strong> The portfolio chatbot runs completely locally in your browser. Messages do not leave your device and are processed purely clientside.</li>
          <li><strong>Contact Form Security:</strong> Submitting the contact form constructs a prefilled <code>mailto:</code> link which launches your own native email client, ensuring your message is transmitted securely via standard email protocols.</li>
        </ul>
        <p className="pt-4 border-t border-[#1E293B] text-xs text-slate-500">
          Last updated: July 21, 2026.
        </p>
      </div>
    </div>
  );
}
