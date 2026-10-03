import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import api from "../api";
import Navbar from "../components/Navbar";

const SUGGESTIONS = [
  "Tôi còn thiếu chất gì?",
  "Gợi ý bữa tối cân bằng",
  "Protein hôm nay đủ chưa?",
  "Bữa tối nay tôi nên ăn gì?",
];

function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Chào bạn! Mình có thể gợi ý dựa trên các bữa ăn bạn đã ghi hôm nay. Bạn muốn biết điều gì?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: text, history: newMessages });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Xin lỗi, mình gặp lỗi khi trả lời. Thử lại nhé." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner giới thiệu */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Agent dinh dưỡng</h1>
            <p className="text-gray-500 text-sm">Hỏi nhanh, nhận gợi ý thực tế dựa trên nhật ký của bạn.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Khung chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md flex flex-col" style={{ height: "60vh" }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[75%] ${
                    m.role === "user" ? "bg-green-500 text-white rounded-br-sm" : "bg-green-50 text-gray-800 rounded-bl-sm"
                  }`}>
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-green-50 text-gray-400 text-sm">Đang trả lời...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ví dụ: Bữa tối nay tôi nên ăn gì?"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white w-11 h-11 rounded-xl flex items-center justify-center transition disabled:opacity-50 flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Gợi ý câu hỏi */}
          <div className="bg-green-50 rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-gray-800 font-bold mb-1">
              <Sparkles size={16} className="text-green-600" /> Bạn có thể hỏi
            </div>
            <p className="text-gray-500 text-sm mb-4">Chọn một gợi ý hoặc tự nhập câu hỏi của bạn.</p>

            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="text-left text-sm font-medium text-green-700 bg-white hover:bg-green-100 border border-green-100 rounded-full px-4 py-2 transition disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              Lưu ý: Nội dung từ AI Agent chỉ mang tính tham khảo, không thay thế tư vấn, chẩn đoán hoặc điều trị y tế chuyên môn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;