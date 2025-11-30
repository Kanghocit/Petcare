"use client";

import React, { useState } from "react";
import {
  MessageOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import ChatBox from "../chat/ChatBox";

const FloatingActionButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Boss Pet Brands",
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link đã được sao chép!");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Right side action buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-3">
        <button
          onClick={handleRefresh}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Làm mới"
        >
          <ReloadOutlined className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Chia sẻ"
        >
          <ShareAltOutlined className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Lên đầu trang"
        >
          <ArrowUpOutlined className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Bottom right floating action button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <MessageOutlined className="w-5 h-5" />
          <span className="font-medium">Hỗ trợ</span>
        </button>
      </div>

      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingActionButton;
