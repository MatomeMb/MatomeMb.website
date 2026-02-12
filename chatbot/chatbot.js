/* Portfolio chatbot: local, grounded, no logging. */
(function () {
  'use strict';

  // Prefer embedding the knowledge base into the HTML to avoid any network 404s.
  // Fallback to fetching the JSON file only if the embedded payload is missing.
  const KNOWLEDGE_URL = 'chatbot/chatbot_knowledge.json';
  const EMBEDDED_KB_ID = 'mm-chatbot-kb';

  const state = {
    kb: null,
    open: false,
    lastFocus: null,
    messages: [],
    voiceRecognition: null
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'dataset') Object.assign(n.dataset, v);
      else if (k.startsWith('aria-')) n.setAttribute(k, String(v));
      else if (k === 'text') n.textContent = String(v);
      else n.setAttribute(k, String(v));
    });
    children.forEach((c) => n.appendChild(c));
    return n;
  }

  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(s) {
    const t = normalize(s).split(' ').filter(Boolean);
    // Remove very common stop-words; keep it minimal to avoid unexpected behavior
    const stop = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'is', 'are', 'do', 'does', 'can', 'you', 'i', 'me', 'my', 'his', 'her', 'he', 'she', 'it', 'this', 'that', 'what', 'how', 'about', 'has', 'have', 'was', 'be']);
    return t.filter((w) => !stop.has(w));
  }

  // Lightweight stemmer — strips common suffixes for better matching
  function stem(word) {
    if (word.length < 4) return word;
    return word
      .replace(/ies$/, 'y')
      .replace(/ying$/, 'y')
      .replace(/tion$/, 't')
      .replace(/sion$/, 's')
      .replace(/ment$/, '')
      .replace(/ness$/, '')
      .replace(/able$/, '')
      .replace(/ible$/, '')
      .replace(/ally$/, '')
      .replace(/ful$/, '')
      .replace(/ing$/, '')
      .replace(/ous$/, '')
      .replace(/ive$/, '')
      .replace(/ed$/, '')
      .replace(/er$/, '')
      .replace(/ly$/, '')
      .replace(/s$/, '');
  }

  // Synonym map for common query variations
  const SYNONYMS = {
    'job': 'role', 'jobs': 'role', 'position': 'role', 'positions': 'role', 'opening': 'role', 'hire': 'role', 'hiring': 'role', 'employ': 'role', 'work': 'role',
    'cv': 'resume', 'curriculum': 'resume',
    'school': 'education', 'study': 'education', 'studied': 'education', 'university': 'education', 'college': 'education', 'degree': 'education',
    'cert': 'certification', 'certs': 'certification', 'badges': 'certification', 'badge': 'certification', 'credential': 'certification', 'credentials': 'certification',
    'reach': 'contact', 'connect': 'contact', 'message': 'contact', 'email': 'contact', 'mail': 'contact',
    'tech': 'skill', 'technologies': 'skill', 'tools': 'skill', 'stack': 'skill', 'proficient': 'skill', 'expertise': 'skill',
    'project': 'projects', 'portfolio': 'projects', 'built': 'projects', 'build': 'projects',
    'background': 'experience', 'history': 'experience', 'career': 'experience',
    'ai': 'ml', 'machine learning': 'ml', 'deep learning': 'ml', 'artificial intelligence': 'ml'
  };

  function expandSynonyms(tokens) {
    return tokens.map((t) => SYNONYMS[t] || t);
  }

  function overlapScore(aTokens, bTokens) {
    if (!aTokens.length || !bTokens.length) return 0;
    const aStemmed = aTokens.map(stem);
    const bStemmed = bTokens.map(stem);
    const aExpanded = expandSynonyms(aStemmed);
    const bExpanded = new Set([...bStemmed, ...expandSynonyms(bStemmed)]);
    let hit = 0;
    aExpanded.forEach((t) => { if (bExpanded.has(t)) hit += 1; });
    // Also check original tokens for exact matches
    const bOrigSet = new Set(bTokens);
    aTokens.forEach((t) => { if (bOrigSet.has(t)) hit += 0.5; });
    return hit / Math.max(aTokens.length, bTokens.length);
  }

  function isSensitivePrompt(text) {
    const t = normalize(text);
    const patterns = [
      /disciplin/i,
      /exclusion/i,
      /registrar/i,
      /transcript/i,
      /\bcode(s)?\b/i,
      /medical/i,
      /health/i,
      /legal/i,
      /case\s+number/i,
      /\bnda\b.*(client|company|name)/i,
      /(client|company)\s+name/i
    ];
    return patterns.some((re) => re.test(t));
  }

  function isNdaProbe(text) {
    const t = normalize(text);
    return /\bnda\b/i.test(t) || /(client|company)\s+name/i.test(t) || /who\s+was\s+it\s+for/i.test(t);
  }

  function pickFaqAnswer(text, faq) {
    const qTokens = tokenize(text);
    const candidates = [];
    for (const item of faq || []) {
      const s = overlapScore(qTokens, tokenize(item.q));
      if (s > 0) candidates.push({ item, score: s });
    }
    // Also try matching against FAQ answer text for better recall
    for (const item of faq || []) {
      const s = overlapScore(qTokens, tokenize(item.a));
      const existing = candidates.find((c) => c.item.id === item.id);
      if (existing) {
        existing.score = Math.max(existing.score, s * 0.7); // Discount answer matches slightly
      } else if (s > 0) {
        candidates.push({ item, score: s * 0.7 });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    // Conservative threshold to avoid mismatched answers
    if (candidates.length && candidates[0].score >= 0.2) return candidates[0].item;
    return null;
  }

  // Detect greetings for a friendlier first response
  function isGreeting(text) {
    const t = normalize(text);
    return /^(hi|hello|hey|howdy|sup|yo|greetings|good\s*(morning|afternoon|evening))(\s|$)/i.test(t);
  }

  function formatHighlights(kb) {
    const lines = [];
    lines.push('Public-safe highlights:');
    (kb.highlights || []).forEach((h) => lines.push(`- ${h}`));
    return lines.join('\n');
  }

  function formatProjectCaseStudy(project) {
    const cs = project?.caseStudy || {};
    const lines = [];
    lines.push(`${project?.name || 'Project'} (public-safe)`);
    if (cs.outcome) lines.push(`Outcome: ${cs.outcome}`);
    if (cs.approach) lines.push(`Approach: ${cs.approach}`);
    if (cs.reliability) lines.push(`Reliability: ${cs.reliability}`);
    if (Array.isArray(cs.stack) && cs.stack.length) lines.push(`Stack: ${cs.stack.join(', ')}`);
    if (Array.isArray(cs.links) && cs.links.length) {
      lines.push('Links:');
      cs.links.forEach((l) => {
        if (l?.label && l?.url) lines.push(`- ${l.label}: ${l.url}`);
      });
    }
    lines.push('');
    lines.push('If you want, ask: “Show skills”, “Show experience”, or “How do I contact Matome?”');
    return lines.join('\n');
  }

  function pickProject(text, kb) {
    const t = normalize(text);
    const projects = kb.projects || [];
    if (!projects.length) return null;

    // Shortcut keyword routing
    const keywordToName = [
      { re: /\bocr\b|\bcomputer vision\b|\bdocument automation\b/, name: 'OCR document automation' },
      { re: /\brag\b|\bretrieval\b|\bfaiss\b/, name: 'Retrieval assistant (RAG)' },
      { re: /\bembedded\b|\bedge\b|\bstm32\b|\bsensor\b/, name: 'Embedded / edge foundations' },
      { re: /\bnda\b|\bconfidential\b/, name: 'Confidential AI product build (NDA)' }
    ];
    for (const k of keywordToName) {
      if (k.re.test(t)) {
        const hit = projects.find((p) => normalize(p.name) === normalize(k.name));
        if (hit) return hit;
      }
    }

    // Fuzzy match against project names
    const qTokens = tokenize(text);
    let best = null;
    let bestScore = 0;
    for (const p of projects) {
      const s = overlapScore(qTokens, tokenize(p.name || ''));
      if (s > bestScore) {
        bestScore = s;
        best = p;
      }
    }
    if (best && bestScore >= 0.25) return best;
    return null;
  }

  function formatProjects(kb) {
    const lines = [];
    lines.push('Selected case studies (public-safe):');
    (kb.projects || []).forEach((p) => {
      const cs = p.caseStudy || {};
      lines.push(`- ${p.name}: ${cs.outcome || ''}`.trim());
    });
    lines.push('');
    lines.push('Tip: ask about a specific project (e.g., “Tell me about OCR” or “Tell me about RAG”).');
    return lines.join('\n');
  }

  function formatSkills(kb) {
    const s = kb.skills || {};
    const lines = [];
    lines.push('Skills summary:');
    if (s.ocrComputerVision?.length) lines.push(`- OCR / Computer Vision: ${s.ocrComputerVision.join('; ')}`);
    if (s.retrievalRag?.length) lines.push(`- Retrieval (RAG): ${s.retrievalRag.join('; ')}`);
    if (s.backendServices?.length) lines.push(`- Backend / Services: ${s.backendServices.join('; ')}`);
    if (s.shippingDiscipline?.length) lines.push(`- Shipping discipline: ${s.shippingDiscipline.join('; ')}`);
    if (s.embeddedFundamentals?.length) lines.push(`- Embedded fundamentals: ${s.embeddedFundamentals.join('; ')}`);
    return lines.join('\n');
  }

  function formatCredibility(kb) {
    const lines = [];
    lines.push('Credibility (public-safe):');
    (kb.certifications || []).forEach((c) => {
      if (c.proof) lines.push(`- ${c.name} (proof: ${c.proof})`);
      else lines.push(`- ${c.name}`);
    });
    lines.push(`- GitHub: ${kb.links.github}`);
    lines.push(`- LinkedIn: ${kb.links.linkedin}`);
    lines.push(`- Credly: ${kb.links.credly}`);
    return lines.join('\n');
  }

  function credibilityActions(kb) {
    const actions = [];
    (kb.certifications || []).forEach((c) => {
      if (c?.name && c?.proof) actions.push({ label: c.name, url: c.proof });
    });
    if (kb?.links?.credly) actions.push({ label: 'Credly', url: kb.links.credly });
    if (kb?.links?.github) actions.push({ label: 'GitHub', url: kb.links.github });
    if (kb?.links?.linkedin) actions.push({ label: 'LinkedIn', url: kb.links.linkedin });
    return actions;
  }

  function formatContact(kb) {
    return [
      'Contact:',
      `- Email: ${kb.links.email.replace('mailto:', '')}`,
      `- LinkedIn: ${kb.links.linkedin}`,
      `- GitHub: ${kb.links.github}`,
      `- Credly: ${kb.links.credly}`
    ].join('\n');
  }

  function contactActions(kb) {
    const links = kb?.links || {};
    const actions = [];
    if (links.email) actions.push({ label: 'Email', url: links.email });
    if (links.linkedin) actions.push({ label: 'LinkedIn', url: links.linkedin });
    if (links.github) actions.push({ label: 'GitHub', url: links.github });
    return actions;
  }

  function answerFromKb(text, kb) {
    const safety = kb.safety || {};

    if (isSensitivePrompt(text)) {
      const actions = contactActions(kb);
      if (isNdaProbe(text)) return { a: safety.refusals?.nda || 'Some work is under NDA.', source: 'Safety policy', actions };
      return { a: safety.refusals?.sensitive || 'I can’t help with that.', source: 'Safety policy', actions };
    }

    const t = normalize(text);

    // Greetings
    if (isGreeting(text)) {
      return {
        a: 'Hi! I can help with questions about Matome\'s skills, projects, experience, certifications, or contact info. What would you like to know?',
        source: 'Greeting'
      };
    }

    // Specific project deep-dive (more insightful, still grounded)
    const projectHit = pickProject(text, kb);
    if (projectHit && /\b(project|case|study|work|tell|about|explain|details)\b/.test(t)) {
      const links = projectHit?.caseStudy?.links || [];
      const linkActions = Array.isArray(links)
        ? links.filter((l) => l?.label && l?.url).map((l) => ({ label: l.label, url: l.url }))
        : [];
      return { a: formatProjectCaseStudy(projectHit), source: 'Projects (case study)', actions: linkActions.length ? linkActions : undefined };
    }

    // Metrics / impact
    if (/\b(metric|metrics|impact|results|outcome|kpi|proof)\b/.test(t)) {
      return { a: formatHighlights(kb), source: 'Highlights' };
    }

    if (/\b(project|case study|case studies|work)\b/.test(t)) {
      return { a: formatProjects(kb), source: 'Projects' };
    }
    if (/\b(skill|stack|tech|technology)\b/.test(t)) {
      return { a: formatSkills(kb), source: 'Skills' };
    }
    if (/\b(cert|badge|credly|credential)\b/.test(t)) {
      return { a: formatCredibility(kb), source: 'Certifications', actions: credibilityActions(kb) };
    }
    if (/\b(contact|email|reach|linkedin)\b/.test(t)) {
      return { a: formatContact(kb), source: 'Contact', actions: contactActions(kb) };
    }
    if (/\b(experience|background|recent experience)\b/.test(t)) {
      const lines = [];
      lines.push('Experience (public-safe):');
      (kb.experience || []).forEach((e) => {
        if (!e?.area) return;
        lines.push(`- ${e.area}`);
        (e.summary || []).forEach((s) => lines.push(`  - ${s}`));
      });
      return { a: lines.join('\n'), source: 'Experience' };
    }
    if (/\b(education|university|uct|degree|graduat)\b/.test(t)) {
      const edu = kb.education || {};
      const line = edu.status
        ? `${edu.institution || ''} — ${edu.field || ''}. ${edu.status}.`
        : edu.approvedLine || '';
      return { a: `Education: ${line}`.trim(), source: 'Education' };
    }
    if (/\b(role|roles|looking for|availability|remote|hybrid)\b/.test(t)) {
      return { a: kb.profile?.workPolicy || safety.refusals?.unknown, source: 'Work policy' };
    }

    const faqHit = pickFaqAnswer(text, kb.faq || []);
    if (faqHit) return { a: faqHit.a, source: 'FAQ' };

    return {
      a: safety.refusals?.unknown || 'I don’t have that detail in my public portfolio notes.',
      source: 'Safety policy',
      actions: contactActions(kb)
    };
  }

  function typewriterEffect(element, text, speed = 20) {
    return new Promise((resolve) => {
      let index = 0;
      element.textContent = '';
      
      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      
      type();
    });
  }

  function appendMessage(bodyEl, role, text, meta, actions, useTypewriter = false) {
    const msg = el('div', { class: 'mm-chatbot-msg', dataset: { role } });
    const bubble = el('div', { class: 'mm-chatbot-bubble' });
    
    if (role === 'bot' && useTypewriter) {
      bubble.textContent = ''; // Start empty for typewriter
      msg.appendChild(bubble);
      if (meta) msg.appendChild(el('div', { class: 'mm-chatbot-meta', text: meta }));
      
      bodyEl.appendChild(msg);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      
      // Typewriter effect
      typewriterEffect(bubble, text).then(() => {
        if (Array.isArray(actions) && actions.length) {
          const row = el('div', { class: 'mm-chatbot-actions', 'aria-label': 'Quick actions' });
          actions.slice(0, 3).forEach((a) => {
            if (!a?.label || !a?.url) return;
            const isMailto = String(a.url).startsWith('mailto:');
            const link = el('a', {
              class: 'mm-chatbot-action',
              href: a.url,
              ...(isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' }),
              'aria-label': a.label,
              text: a.label
            });
            row.appendChild(link);
          });
          msg.appendChild(row);
          bodyEl.scrollTop = bodyEl.scrollHeight;
        }
      });
    } else {
      bubble.textContent = text;
      msg.appendChild(bubble);
      if (meta) msg.appendChild(el('div', { class: 'mm-chatbot-meta', text: meta }));

      if (Array.isArray(actions) && actions.length) {
        const row = el('div', { class: 'mm-chatbot-actions', 'aria-label': 'Quick actions' });
        actions.slice(0, 3).forEach((a) => {
          if (!a?.label || !a?.url) return;
          const isMailto = String(a.url).startsWith('mailto:');
          const link = el('a', {
            class: 'mm-chatbot-action',
            href: a.url,
            ...(isMailto ? {} : { target: '_blank', rel: 'noopener noreferrer' }),
            'aria-label': a.label,
            text: a.label
          });
          row.appendChild(link);
        });
        msg.appendChild(row);
      }

      bodyEl.appendChild(msg);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    // Save to message history
    state.messages.push({ role, text, meta, timestamp: Date.now() });
    saveMessageHistory();
  }

  function saveMessageHistory() {
    try {
      localStorage.setItem('mm-chatbot-history', JSON.stringify(state.messages.slice(-50))); // Keep last 50 messages
    } catch (e) {
      // Ignore storage errors
    }
  }

  function loadMessageHistory() {
    try {
      const saved = localStorage.getItem('mm-chatbot-history');
      if (saved) {
        state.messages = JSON.parse(saved);
        return true;
      }
    } catch (e) {
      // Ignore parse errors
    }
    return false;
  }

  function focusables(root) {
    return Array.from(root.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter((n) => !n.hasAttribute('disabled') && n.getAttribute('aria-hidden') !== 'true');
  }

  function mountWidget() {
    const launcher = el('button', {
      class: 'mm-chatbot-launcher',
      type: 'button',
      'aria-label': 'Open portfolio assistant',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false'
    }, []);
    launcher.innerHTML = `
      <span class="mm-chatbot-launcherIcon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 10h10M7 14h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 6h12a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H11l-5 3v-3H6a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="sr-only">Open portfolio assistant</span>
    `;

    const overlay = el('div', { class: 'mm-chatbot-overlay', dataset: { open: 'false' } });

    const panel = el('div', {
      class: 'mm-chatbot-panel',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Portfolio assistant',
      dataset: { open: 'false' }
    });

    const header = el('div', { class: 'mm-chatbot-header' });
    header.appendChild(el('div', { class: 'mm-chatbot-title' }, [
      el('div', { class: 'mm-chatbot-mark', text: 'MM' }),
      el('div', { class: 'mm-chatbot-titleText' }, [
        el('strong', { text: 'Assistant' }),
        el('span', { text: 'Grounded in public notes only.' })
      ])
    ]));
    const closeBtn = el('button', { class: 'mm-chatbot-close', type: 'button', 'aria-label': 'Close assistant' });
    closeBtn.textContent = 'Close';
    header.appendChild(closeBtn);

    const body = el('div', { class: 'mm-chatbot-body' });
    const suggestions = el('div', { class: 'mm-chatbot-suggestions', 'aria-label': 'Suggested questions' });

    const input = el('textarea', {
      class: 'mm-chatbot-input',
      rows: '2',
      placeholder: 'Ask about skills, projects, certifications, or contact…',
      'aria-label': 'Message'
    });
    const sendBtn = el('button', { class: 'mm-chatbot-send', type: 'button' });
    sendBtn.textContent = 'Send';
    
    // Voice input button
    const voiceBtn = el('button', { 
      class: 'mm-chatbot-voice', 
      type: 'button',
      'aria-label': 'Voice input',
      title: 'Voice input (if supported)'
    });
    voiceBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    `;
    
    // Check for voice recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      state.voiceRecognition = new SpeechRecognition();
      state.voiceRecognition.continuous = false;
      state.voiceRecognition.interimResults = false;
      state.voiceRecognition.lang = 'en-US';
      
      state.voiceRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        handleSend(transcript);
      };
      
      state.voiceRecognition.onerror = () => {
        voiceBtn.classList.remove('active');
      };
      
      state.voiceRecognition.onend = () => {
        voiceBtn.classList.remove('active');
      };
      
      voiceBtn.addEventListener('click', () => {
        if (state.voiceRecognition) {
          if (voiceBtn.classList.contains('active')) {
            state.voiceRecognition.stop();
            voiceBtn.classList.remove('active');
          } else {
            state.voiceRecognition.start();
            voiceBtn.classList.add('active');
          }
        }
      });
    } else {
      voiceBtn.style.display = 'none';
    }

    const footer = el('div', { class: 'mm-chatbot-footer' }, [
      el('div', { class: 'mm-chatbot-inputRow' }, [input, voiceBtn, sendBtn]),
      el('div', { class: 'mm-chatbot-disclaimer', text: 'Messages are stored locally. This assistant answers only from a local knowledge base and refuses sensitive or NDA-specific requests.' })
    ]);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(suggestions);
    panel.appendChild(footer);

    document.body.appendChild(launcher);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    function setOpen(open) {
      state.open = open;
      panel.dataset.open = open ? 'true' : 'false';
      overlay.dataset.open = open ? 'true' : 'false';
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        state.lastFocus = document.activeElement;
        input.focus();
      } else {
        (state.lastFocus || launcher).focus();
      }
    }

    function handleSend(text) {
      const trimmed = (text || '').trim();
      if (!trimmed) return;
      appendMessage(body, 'user', trimmed);
      input.value = '';

      const out = answerFromKb(trimmed, state.kb);
      const meta = out.source ? `Source: ${out.source}` : null;
      appendMessage(body, 'bot', out.a, meta, out.actions, true); // Use typewriter for bot messages
    }
    
    function restoreHistory() {
      if (loadMessageHistory() && state.messages.length > 0) {
        body.innerHTML = '';
        state.messages.forEach(msg => {
          appendMessage(body, msg.role, msg.text, msg.meta, null, false);
        });
      }
    }

    function seedSuggestions() {
      const items = [
        { label: 'What roles are you looking for?', value: 'What roles is Matome looking for?' },
        { label: 'Show case studies', value: 'Show case studies' },
        { label: 'Skills summary', value: 'Skills summary' },
        { label: 'Certifications', value: 'What certifications are publicly verifiable?' },
        { label: 'Contact', value: 'How do I contact Matome?' }
      ];
      suggestions.innerHTML = '';
      items.forEach((it) => {
        const b = el('button', { class: 'mm-chatbot-chip', type: 'button' });
        b.textContent = it.label;
        b.addEventListener('click', () => handleSend(it.value));
        suggestions.appendChild(b);
      });
    }

    launcher.addEventListener('click', () => {
      if (!state.kb) return;
      setOpen(!state.open);
    });
    closeBtn.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));

    sendBtn.addEventListener('click', () => handleSend(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(input.value);
      }
      if (e.key === 'Escape') setOpen(false);
    });

    // Focus trap when open
    panel.addEventListener('keydown', (e) => {
      if (!state.open) return;
      if (e.key === 'Escape') setOpen(false);
      if (e.key !== 'Tab') return;
      const f = focusables(panel);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Initial message
    appendMessage(
      body,
      'bot',
      'Hi. I can answer questions about skills, case studies, credibility, and contact using Matome’s public portfolio notes only.',
      'Grounded: local knowledge base'
    );

    // Restore message history or show initial message
    function restoreHistory() {
      if (loadMessageHistory() && state.messages.length > 0) {
        body.innerHTML = '';
        state.messages.forEach(msg => {
          appendMessage(body, msg.role, msg.text, msg.meta, null, false);
        });
        return true;
      }
      return false;
    }
    
    if (!restoreHistory()) {
      // Initial message already added above, but update it to use typewriter
      const lastMsg = body.querySelector('.mm-chatbot-msg[data-role="bot"]:last-child');
      if (lastMsg) {
        const bubble = lastMsg.querySelector('.mm-chatbot-bubble');
        if (bubble) {
          const text = bubble.textContent;
          bubble.textContent = '';
          typewriterEffect(bubble, text);
        }
      }
    }

    seedSuggestions();

    return { setOpen };
  }

  function loadEmbeddedKnowledge() {
    try {
      const elKb = document.getElementById(EMBEDDED_KB_ID);
      if (!elKb) return null;
      const raw = (elKb.textContent || '').trim();
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  async function loadKnowledge() {
    const embedded = loadEmbeddedKnowledge();
    if (embedded) return embedded;

    const res = await fetch(KNOWLEDGE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load knowledge base');
    return await res.json();
  }

  // Init
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      state.kb = await loadKnowledge();
      mountWidget();
    } catch (e) {
      // Fail silently (no logging by default).
    }
  });
})();

