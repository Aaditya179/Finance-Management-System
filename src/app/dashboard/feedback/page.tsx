"use client";

import { useState } from "react";
import { useToast } from "@/lib/contexts/ToastContext";
import {
  Star,
  Send,
  MessageCircle,
  ThumbsUp,
  Clock,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const FEEDBACK_CATEGORIES = [
  "General",
  "Bug Report",
  "Feature Request",
  "UI/UX",
  "Performance",
  "Other",
];

const PAST_FEEDBACK = [
  {
    id: 1,
    subject: "Dark mode toggle improvement",
    category: "UI/UX",
    rating: 4,
    date: "2026-03-20",
    status: "reviewed",
    message: "The dark mode toggle could use a smoother transition.",
  },
  {
    id: 2,
    subject: "Add multi-currency support",
    category: "Feature Request",
    rating: 5,
    date: "2026-03-15",
    status: "implemented",
    message: "Would love to see INR and EUR support across all dashboards.",
  },
  {
    id: 3,
    subject: "Chart loading lag",
    category: "Performance",
    rating: 3,
    date: "2026-03-10",
    status: "in-progress",
    message: "The statistic charts take a few seconds to render on initial load.",
  },
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState(PAST_FEEDBACK);

  const handleSubmit = () => {
    if (rating === 0 || !message.trim()) return;
    setSubmitted(true);
    const newFeedback = {
      id: Date.now(),
      subject: subject || "General Feedback",
      category,
      rating,
      date: new Date().toISOString().split("T")[0],
      status: "submitted" as const,
      message: message.trim(),
    };
    setFeedbackHistory(prev => [newFeedback, ...prev]);
    toast("Thank you! Your feedback has been submitted");
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setCategory("General");
      setSubject("");
      setMessage("");
    }, 2000);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "reviewed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "implemented":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "in-progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-white/5 text-[#888] border-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reviewed":
        return <ThumbsUp className="w-3 h-3" />;
      case "implemented":
        return <CheckCircle2 className="w-3 h-3" />;
      case "in-progress":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[900px] mx-auto pb-10">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Feedback</h1>
        <p className="text-[#888888] text-[14px] mt-1">Help us improve Nexora with your valuable insights</p>
      </div>

      {/* Feedback Form */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-white">Send Feedback</h3>
            <p className="text-[13px] text-[#666]">Share your experience or report an issue</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="text-[14px] font-medium text-white mb-3 block">How would you rate your experience?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125 focus:scale-125"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-[#333] fill-transparent"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-[13px] text-[#888]">
                  {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                </span>
              )}
            </div>
          </div>

          {/* Category Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-light/30 transition-colors"
                >
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[14px] font-medium text-white mb-2 block">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary..."
                className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-[14px] font-medium text-white mb-2 block">Your Feedback</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/5 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-brand-light/30 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#555]">All feedback is reviewed by our team</span>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !message.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-[14px] transition-all ${
                submitted
                  ? "bg-green-500/20 text-green-400 border border-green-500/20"
                  : rating > 0 && message.trim()
                  ? "bg-brand-gradient text-white shadow-[0_4px_14px_0_rgba(252,96,118,0.2)] hover:-translate-y-0.5"
                  : "bg-white/5 text-[#555] cursor-not-allowed border border-white/5"
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submitted!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Past Feedback */}
      <div className="bg-[#141414] rounded-2xl p-6 border border-white/5">
        <h3 className="text-[16px] font-semibold text-white mb-6">Your Previous Feedback</h3>
        <div className="space-y-3">
          {feedbackHistory.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-[14px] font-medium text-white group-hover:text-brand-light transition-colors">{fb.subject}</h4>
                  <p className="text-[12px] text-[#555] mt-0.5">{fb.date} • {fb.category}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium border ${getStatusStyles(fb.status)}`}>
                  {getStatusIcon(fb.status)}
                  {fb.status.replace("-", " ")}
                </span>
              </div>
              <p className="text-[13px] text-[#888] mb-3">{fb.message}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? "text-amber-400 fill-amber-400" : "text-[#333]"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
