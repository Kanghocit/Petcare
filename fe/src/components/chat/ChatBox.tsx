"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import resolveImageSrc from "@/utils/resolveImageSrc";

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discount?: number;
  images?: string[];
  isNewProduct?: boolean;
  isSaleProduct?: boolean;
  star?: number;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  products?: Product[];
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý AI của Kangdy PetShop. Tôi có thể giúp gì cho bạn hôm nay? 😊",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
        sender: "ai",
        timestamp: new Date(),
        products: data.products || undefined, // Thêm sản phẩm vào message
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline: 0332653962",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <RobotOutlined className="text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Kangdy AI</h3>
            <p className="text-xs text-white/90">
              Trợ lý thông minh Kangdy PetShop
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <CloseOutlined className="text-lg" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="bg-orange-500 rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <RobotOutlined className="text-white! text-sm" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>

              {/* Hiển thị sản phẩm nếu có */}
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Sản phẩm gợi ý:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {message.products.slice(0, 4).map((product) => {
                      const finalPrice =
                        product.discount && product.discount > 0
                          ? product.price * (1 - product.discount / 100)
                          : product.price;
                      const productImage: string = product.images?.[0]
                        ? resolveImageSrc(product.images[0]) ||
                          "/images/account.webp"
                        : "/images/account.webp";

                      return (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2">
                            <Image
                              src={productImage}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 150px"
                            />
                            {product.isNewProduct && (
                              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                Mới
                              </div>
                            )}
                            {product.isSaleProduct && product.discount && (
                              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {product.discount && product.discount > 0 ? (
                              <>
                                <span className="text-red-500 font-bold text-xs">
                                  {finalPrice.toLocaleString("vi-VN")}₫
                                </span>
                                <span className="text-gray-400 text-xs line-through">
                                  {product.price.toLocaleString("vi-VN")}₫
                                </span>
                              </>
                            ) : (
                              <span className="text-red-500 font-bold text-xs">
                                {product.price.toLocaleString("vi-VN")}₫
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-white/70" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.sender === "user" && (
              <div className="bg-gray-300 rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <UserOutlined className="text-gray-600 text-sm" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-orange-500 rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
              <RobotOutlined className="text-white text-sm" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <Spin size="small" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <SendOutlined className="text-lg" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Trợ lý AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
