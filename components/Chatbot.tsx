"use client";

import { useContent } from "./ContentProvider";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconMessageChatbot,
  IconX,
  IconSend,
  IconSparkles,
  IconRefresh,
  IconChevronDown,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}


const FUN_LOADING_TEXTS = [
  "Mencari info prodi idamanmu...",
  "Mengecek kuota beasiswa...",
  "Melihat fasilitas kamar asrama...",
  "Menyeduh kopi santri sebentar...",
  "Membuka arsip panduan PMB...",
  "Meracik jawaban paling akurat...",
  "Konsultasi kilat ke sekretariat...",
  "Menghitung rincian biaya kuliah...",
];

export default function Chatbot() {
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        content.chatbot.greeting,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestBotMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate fun loading messages while waiting for Gemini
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % FUN_LOADING_TEXTS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOpen) return;

    setHasOpenedBefore(true);

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role === "assistant" && messages.length > 1) {
      // Scroll slightly to the top of the AI's answer instead of bottom
      const timer = setTimeout(() => {
        latestBotMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
      return () => clearTimeout(timer);
    } else {
      // User question or initial open: scroll to bottom
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              `Mohon maaf, tidak dapat memperoleh jawaban saat ini. Silakan hubungi WhatsApp PMB di ${content.contact.whatsapp}.`,
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to send chat message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `Terjadi gangguan jaringan saat menghubungi asisten AI. Silakan periksa koneksi Anda atau hubungi WhatsApp PMB di ${content.contact.whatsapp}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Percakapan direset. Silakan tanyakan informasi seputar PMB UNIPDU.",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to format bold text, clickable URLs, and WhatsApp phone numbers
  const formatInline = (content: string) => {
    // Regex to match URLs or Indonesian phone numbers (+628... or 08...)
    const tokenRegex = /(https?:\/\/[^\s)]+|(?:\+?62|0)8[0-9\s\-]{7,13}[0-9])/g;

    // Split content by bold tags **text**
    const boldParts = content.split(/(\*\*.*?\*\*)/g);

    return boldParts.map((bp, bIdx) => {
      const isBold = bp.startsWith("**") && bp.endsWith("**");
      const text = isBold ? bp.slice(2, -2) : bp;

      // Sub-split by URLs and phone numbers
      const subParts = text.split(tokenRegex);

      const renderedParts = subParts.map((part, pIdx) => {
        const key = `inline-${bIdx}-${pIdx}`;

        // 1. URLs
        if (part.startsWith("http://") || part.startsWith("https://")) {
          return (
            <a
              key={key}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline hover:text-emerald-900 break-all font-medium"
            >
              {part}
            </a>
          );
        }

        // 2. Phone Numbers -> WhatsApp link
        if (/^(?:\+?62|0)8[0-9\s\-]{7,13}[0-9]$/.test(part)) {
          const cleanDigits = part.replace(/\D/g, "");
          const waNumber = cleanDigits.startsWith("0") ? "62" + cleanDigits.slice(1) : cleanDigits;
          const waUrl = `https://wa.me/${waNumber}`;

          return (
            <a
              key={key}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Chat WhatsApp ke ${part}`}
              className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300/70 hover:border-emerald-500 transition-colors cursor-pointer text-[12px] align-baseline mx-0.5"
            >
              <IconBrandWhatsapp size={13} className="text-emerald-600 flex-shrink-0" />
              <span>{part}</span>
            </a>
          );
        }

        // 3. Normal text
        return part;
      });

      if (isBold) {
        return (
          <strong key={`bold-${bIdx}`} className="font-semibold text-emerald-950">
            {renderedParts}
          </strong>
        );
      }

      return <span key={`span-${bIdx}`}>{renderedParts}</span>;
    });
  };

  // Structured markdown renderer for lists, indentation, bold, and links
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      const isIndented = line.startsWith("  ") || line.startsWith("\t");

      // Numbered list items (e.g., "1. Program Name")
      const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        const num = numberedMatch[1];
        const itemText = numberedMatch[2];
        return (
          <div key={idx} className={`flex items-start gap-2 my-1 ${isIndented ? "ml-4" : "ml-0.5"}`}>
            <span className="font-semibold text-emerald-900 text-xs leading-5 min-w-[14px]">
              {num}.
            </span>
            <div className="leading-snug text-body flex-1">
              {formatInline(itemText)}
            </div>
          </div>
        );
      }

      // Bullet list items (e.g., "- Prodi" or "* Prodi")
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const itemText = trimmed.slice(2);
        return (
          <div key={idx} className={`flex items-start gap-2 my-1 ${isIndented ? "ml-4" : "ml-0.5"}`}>
            <span className="text-gold font-bold text-sm leading-5 select-none">
              •
            </span>
            <div className="leading-snug text-body flex-1">
              {formatInline(itemText)}
            </div>
          </div>
        );
      }

      // Regular paragraph line
      return (
        <p key={idx} className="my-1 leading-relaxed">
          {formatInline(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 flex flex-col items-end">
      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[92vw] sm:w-[390px] md:w-[410px] h-[580px] max-h-[82vh] bg-paper rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden mb-3.5 select-text"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 border-b border-emerald-800/80 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                  <IconSparkles size={22} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-emerald-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-serif text-[15.5px] font-medium leading-tight text-white flex items-center gap-1.5">
                    Asisten PMB UNIPDU
                  </h3>
                  <p className="text-[11px] text-emerald-100/75 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Berbasis Gemini AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Mulai percakapan baru"
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <IconRefresh size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Tutup Chat"
                  className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <IconChevronDown size={20} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[13.5px] bg-[#fbfaf7]/80">
              {messages.map((msg, index) => {
                const isLatestBotMessage =
                  index === messages.length - 1 && msg.role === "assistant";

                return (
                  <motion.div
                    key={index}
                    ref={isLatestBotMessage ? latestBotMessageRef : undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col scroll-mt-3 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-900 text-white rounded-tr-none"
                        : "bg-white text-body border border-line rounded-tl-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {renderFormattedText(msg.content)}
                  </div>
                  <span className="text-[10px] text-muted/70 px-1 mt-1">
                    {msg.role === "user" ? "Anda" : "Asisten PMB"}
                  </span>
                </motion.div>
              );
            })}

              {/* Fun Rotating Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="bg-white border border-line rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm flex items-center gap-2.5 max-w-[92%]">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-800 animate-bounce" />
                    </div>
                    <div className="overflow-hidden min-h-[18px] flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={loadingTextIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.22 }}
                          className="text-[12px] font-medium text-emerald-950/80 italic select-none"
                        >
                          {FUN_LOADING_TEXTS[loadingTextIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips (if only initial greeting) */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 bg-white/70 border-t border-line/60">
                <p className="text-[11px] font-medium text-muted mb-1.5">
                  Pertanyaan Populer:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {content.chatbot.questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[11.5px] bg-white hover:bg-emerald-50 text-emerald-900 border border-line hover:border-emerald-700/40 rounded-full px-2.5 py-1 transition-all text-left truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-line">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pertanyaan seputar PMB..."
                  disabled={isLoading}
                  className="flex-1 bg-paper border border-line rounded-xl px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-emerald-800 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-emerald-900 hover:bg-emerald-950 disabled:bg-emerald-900/40 text-white flex items-center justify-center transition-all disabled:cursor-not-allowed active:scale-95 shadow-sm flex-shrink-0"
                >
                  <IconSend size={18} />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1 text-[10.5px] text-muted">
                <span>Didukung oleh Google Gemini</span>
                <a
                  href={content.site.registrationUrl}
                  className="text-emerald-800 hover:underline"
                >
                  Formulir pendaftaran
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center gap-2.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white pl-4 pr-5 py-3.5 rounded-full shadow-[0_8px_25px_rgba(6,26,18,0.35)] border border-amber-300/30 hover:border-amber-300/70 transition-all duration-300"
        aria-label="Buka Asisten PMB"
      >
        {/* Glow / Ping Indicator */}
        {!hasOpenedBefore && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold" />
          </span>
        )}

        <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
          {isOpen ? <IconX size={18} /> : <IconMessageChatbot size={18} />}
        </div>

        <span className="font-medium text-[13.5px] tracking-wide text-amber-100">
          {isOpen ? "Tutup Chat" : "Tanya PMB UNIPDU"}
        </span>
      </motion.button>
    </div>
  );
}
