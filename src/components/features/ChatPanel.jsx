import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INTERVIEW_SCRIPT, getNextQuestion } from '@/lib/ai/interview-script';

/**
 * ChatPanel - Hiển thị giao diện Chat giao tiếp với AI (Luồng A)
 * Apple-style design: Glassmorphism, smooth corners, subtle shadows.
 */
export default function ChatPanel({ className, onExtractData }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: INTERVIEW_SCRIPT[0].ai_prompt }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // 1. Thêm message của User vào UI
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // 2. Gọi real AI API — /api/ai/interview
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentStep,
          cvData: {}, // truyền thêm nếu cần context
          language: 'vi',
        }),
      });

      const json = await response.json();
      if (!json.success) throw new Error(json.error);

      const { extracted, nextQuestion, nextStep, isComplete } = json.data;

      // 3. Báo CVPreview cập nhật nếu extract được data
      if (extracted && onExtractData) {
        const fieldTarget = INTERVIEW_SCRIPT[currentStep]?.field_target;
        if (fieldTarget) onExtractData(fieldTarget, extracted);
      }

      // 4. Hiển thị câu hỏi tiếp theo hoặc kết thúc
      if (isComplete || !nextQuestion) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'ai',
          content: 'Tuyệt vời! Mình đã ghi nhận đủ thông tin. CV của bạn đang hiện ra bên phải rồi đó 🎉',
        }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: nextQuestion }]);
        if (nextStep !== null && nextStep !== undefined) setCurrentStep(nextStep);
      }

    } catch (error) {
      console.error('[Chat] API error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Xin lỗi, mình đang gặp chút trục trặc. Bạn có thể gửi lại được không?',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white/50 backdrop-blur-xl border-r border-gray-100/50', className)}>
      
      {/* Header */}
      <div className="px-6 py-4 fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AI
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Phù thuỷ CV AI</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              Luôn sẵn sàng
            </p>
          </div>
        </div>
      </div>

      {/* Trailing spacer for fixed header */}
      <div className="h-20 flex-shrink-0"></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-[#007AFF] text-white rounded-2xl rounded-tr-sm" // Apple iMessage Blue
                : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm flex gap-1 shadow-sm items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 p-2 rounded-3xl pb-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-auto">
            <Briefcase size={20} />
          </button>
          
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu trả lời của bạn..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-2 text-[15px] text-gray-700 placeholder-gray-400"
            rows={1}
          />

          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 bg-[#007AFF] text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-gray-300 flex-shrink-0 mb-auto mt-auto"
          >
            <Send size={18} className="translate-x-[1px]" />
          </button>
        </div>
        <div className="text-center mt-3 mb-1">
          <p className="text-[11px] text-gray-400">AI có thể tạo ra thông tin thiếu chính xác. Hãy kiểm tra lại CV ở cạnh phải.</p>
        </div>
      </div>
    </div>
  );
}
