import { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, Plus, MoreVertical, Send, Paperclip, Smile, 
  User, Phone, Video, Info, CheckCheck, Clock,
  ArrowLeft, Building2, Star
} from 'lucide-react';

export default function Chats() {
  const { recentChats } = useSelector(s => s.dashboard);
  const [selectedChat, setSelectedChat] = useState(recentChats[0] || null);
  const [message, setMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  // Mock messages for the selected chat
  const mockHistory = [
    { id: 1, sender: 'customer', text: 'Hi, I am interested in the 4BHK Villa at Palm Springs.', time: '10:15 AM' },
    { id: 2, sender: 'me', text: 'Hello! I would be happy to help you with that. Are you looking for a site visit?', time: '10:18 AM' },
    { id: 3, sender: 'customer', text: 'Yes, possibly this Sunday afternoon around 3 PM?', time: '10:20 AM' },
    { id: 4, sender: 'me', text: 'Sunday 3 PM works perfectly. I will send you the exact location pin.', time: '10:22 AM' },
    { id: 5, sender: 'customer', text: selectedChat?.msg || 'Is the price negotiable?', time: selectedChat?.time || '12 mins ago' },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
      {/* Sidebar - Conversations List */}
      <div className={`w-full lg:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${selectedChat && 'hidden lg:flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
            <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentChats.map((chat, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-b border-slate-100/50 ${
                selectedChat?.name === chat.name ? 'bg-white shadow-sm' : 'hover:bg-white/60'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                  {chat.userAvatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-slate-800 truncate">{chat.name}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{chat.time}</span>
                </div>
                <p className={`text-[11px] truncate leading-snug ${chat.unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                  {chat.msg}
                </p>
              </div>
              {chat.unread && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 flex flex-col min-w-0 bg-white ${!selectedChat && 'hidden lg:flex'}`}>
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
              <MessageSquareText size={40} className="text-slate-200" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">Select a Conversation</h3>
            <p className="text-xs max-w-[200px]">Choose a chat from the left to start messaging your leads.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center -ml-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {selectedChat.userAvatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">{selectedChat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-colors">
                  <Phone size={18} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-colors">
                  <Video size={18} />
                </button>
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showInfo ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-400'}`}
                >
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">Today</span>
              </div>
              
              {mockHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] group`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative ${
                      msg.sender === 'me' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <div className={`absolute bottom-1 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className={`text-[8px] ${msg.sender === 'me' ? 'text-white/70' : 'text-slate-400'}`}>{msg.time}</span>
                        {msg.sender === 'me' && <CheckCheck size={10} className="text-white/70" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-end gap-3 bg-slate-50 p-2 border border-slate-200 rounded-2xl focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-sm py-2 resize-none max-h-32 min-h-[40px] outline-none"
                  rows={1}
                />
                <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                  <Smile size={20} />
                </button>
                <button className="w-10 h-10 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary-600 transition-all active:scale-95 flex-shrink-0">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info Panel - Desktop only */}
      {showInfo && selectedChat && (
        <div className="hidden xl:flex w-72 border-l border-slate-200 bg-white flex-col animate-fade-in">
          <div className="p-6 flex flex-col items-center border-b border-slate-100">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center font-bold text-2xl text-slate-600 mb-4 border-2 border-primary/10">
              {selectedChat.userAvatar}
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{selectedChat.name}</h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-full">{selectedChat.role}</span>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={14} />
                  </div>
                  UserID: {selectedChat.userId}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={14} />
                  </div>
                  +91 9XXXX XXXX0
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Associated Properties</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1.5">
                    <Building2 size={14} className="text-emerald-500" />
                    <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1.5 p-0.5 rounded">Active</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 line-clamp-1">Palm Springs Villa 4BHK</p>
                  <p className="text-[10px] font-bold text-primary mt-1">₹12 Cr</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/20 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1.5">
                    <Star size={14} className="text-amber-500" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 p-0.5 rounded">Interested</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 line-clamp-1">Sky High Luxury Apt</p>
                  <p className="text-[10px] font-bold text-primary mt-1">₹4.5 Cr</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 mt-auto">
            <button className="w-full py-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">
              View Full Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
