import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Product from "../models/Product.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        ok: false,
        message: "Vui lòng nhập câu hỏi",
      });
    }

    // Kiểm tra API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY chưa được cấu hình");
      return res.status(200).json({
        ok: true,
        response:
          "Xin lỗi, tính năng AI chat đang được cấu hình. Vui lòng liên hệ hotline: 0332653962 để được hỗ trợ.",
      });
    }

    // Kiểm tra API key có hợp lệ không bằng cách thử list models
    let availableModels = [];
    try {
      // Thử list models để kiểm tra API key
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models`,
        {
          params: { key: process.env.GEMINI_API_KEY },
        }
      );
      if (response.data?.models) {
        availableModels =
          response.data.models.map((m) => m.name?.replace("models/", "")) || [];
        console.log("✅ Available models:", availableModels.slice(0, 10)); // Log 10 models đầu tiên
      }
    } catch (error) {
      console.error(
        "❌ Error validating API key:",
        error.response?.status,
        error.response?.data || error.message
      );
      // Nếu không thể validate, vẫn tiếp tục thử nhưng log warning
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("⚠️ API Key không hợp lệ hoặc không có quyền truy cập!");
        return res.status(500).json({
          ok: false,
          message: "API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình.",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
      console.warn(
        "⚠️ Không thể validate API key, sẽ thử sử dụng trực tiếp..."
      );
    }

    // Tìm kiếm sản phẩm liên quan đến câu hỏi của user
    let relevantProducts = [];
    let productsContext = "";

    try {
      // Tìm các từ khóa liên quan đến sản phẩm trong câu hỏi
      const productKeywords = [
        "sản phẩm",
        "thức ăn",
        "đồ chơi",
        "phụ kiện",
        "quần áo",
        "vòng cổ",
        "dây xích",
        "bát ăn",
        "chuồng",
        "lồng",
        "cát",
        "cát vệ sinh",
        "thức ăn khô",
        "thức ăn ướt",
        "pate",
        "xương",
        "bánh thưởng",
        "chó",
        "mèo",
        "thú cưng",
        "pet",
        "dog",
        "cat",
        "mua",
        "bán",
        "giá",
        "có gì",
        "gợi ý",
        "tư vấn",
      ];

      const messageLower = message.toLowerCase();
      const hasProductKeywords = productKeywords.some((keyword) =>
        messageLower.includes(keyword)
      );

      if (hasProductKeywords) {
        // Tìm kiếm sản phẩm dựa trên từ khóa trong câu hỏi
        const searchTerms = message
          .split(/\s+/)
          .filter((word) => word.length > 2)
          .slice(0, 5); // Lấy tối đa 5 từ khóa

        if (searchTerms.length > 0) {
          // Escape các ký tự đặc biệt trong regex
          const escapeRegex = (str) =>
            str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const escapedTerms = searchTerms.map(escapeRegex);
          const searchPattern = escapedTerms.join("|");

          const searchQuery = {
            $or: [
              { title: { $regex: searchPattern, $options: "i" } },
              { description: { $regex: searchPattern, $options: "i" } },
              { category: { $regex: searchPattern, $options: "i" } },
              { brand: { $regex: searchPattern, $options: "i" } },
            ],
            status: "active", // Chỉ lấy sản phẩm đang bán
            quantity: { $gt: 0 }, // Chỉ lấy sản phẩm còn hàng
          };

          relevantProducts = await Product.find(searchQuery)
            .select(
              "title description price discount category brand images slug isNewProduct isSaleProduct star"
            )
            .limit(10)
            .lean();
        }

        // Nếu không tìm thấy sản phẩm cụ thể, lấy một số sản phẩm nổi bật
        if (relevantProducts.length === 0) {
          relevantProducts = await Product.find({
            status: "active",
            quantity: { $gt: 0 },
          })
            .select(
              "title description price discount category brand images slug isNewProduct isSaleProduct star"
            )
            .sort({ star: -1, createdAt: -1 })
            .limit(5)
            .lean();
        }

        // Tạo context về sản phẩm cho AI
        if (relevantProducts.length > 0) {
          productsContext =
            "\n\n=== THÔNG TIN SẢN PHẨM CÓ SẴN TRONG CỬA HÀNG ===\n";
          relevantProducts.forEach((product, index) => {
            const finalPrice =
              product.discount > 0
                ? product.price * (1 - product.discount / 100)
                : product.price;

            productsContext += `\n${index + 1}. ${product.title}`;
            if (product.description) {
              productsContext += `\n   Mô tả: ${product.description.substring(
                0,
                100
              )}${product.description.length > 100 ? "..." : ""}`;
            }
            if (product.discount > 0) {
              productsContext += `\n   Giá: ${product.price.toLocaleString(
                "vi-VN"
              )}₫ (giảm ${product.discount}%) → ${finalPrice.toLocaleString(
                "vi-VN"
              )}₫`;
            } else {
              productsContext += `\n   Giá: ${finalPrice.toLocaleString(
                "vi-VN"
              )}₫`;
            }
            productsContext += `\n   Danh mục: ${
              product.category || "Chưa phân loại"
            }`;
            if (product.brand) {
              productsContext += `\n   Thương hiệu: ${product.brand}`;
            }
            if (product.isNewProduct) {
              productsContext += `\n   ⭐ Sản phẩm mới`;
            }
            if (product.isSaleProduct) {
              productsContext += `\n   🔥 Đang giảm giá`;
            }
            productsContext += `\n   Đánh giá: ${"⭐".repeat(
              Math.floor(product.star || 5)
            )} (${product.star || 5}/5)`;
            productsContext += "\n";
          });
          productsContext +=
            "\nKhi khách hàng hỏi về sản phẩm, hãy gợi ý các sản phẩm trên. Nếu khách muốn xem chi tiết, hãy hướng dẫn họ tìm kiếm trên website hoặc liên hệ hotline.\n";
        }
      }
    } catch (error) {
      console.error("Error searching products:", error);
      // Tiếp tục mà không có thông tin sản phẩm nếu có lỗi
    }

    // Tạo system prompt cho trợ lý bán hàng thú cưng
    const systemInstruction = `Bạn là trợ lý AI thân thiện và chuyên nghiệp của cửa hàng Kangdy PetShop - cửa hàng chuyên bán đồ dùng và thức ăn cho thú cưng (chó, mèo).

Nhiệm vụ của bạn:
- Trả lời các câu hỏi về sản phẩm, dịch vụ của cửa hàng
- Tư vấn về sản phẩm phù hợp cho thú cưng dựa trên thông tin sản phẩm có sẵn
- Gợi ý sản phẩm từ danh sách sản phẩm được cung cấp
- Hướng dẫn về chăm sóc thú cưng
- Giải đáp về chính sách đổi trả, bảo hành, giao hàng
- Hỗ trợ đặt hàng và thanh toán

Chủ cửa hàng: 
Bùi An Khang 
Email: ankhangit06@gmail.com
Phone: 0332653962
Ngoại hình: Cao, To, Đặc biệt là ĐẸP TRAI

Thông tin cửa hàng:
- Hotline: 0332653962
- Địa chỉ: Bắc Từ Liêm, Hà Nội
- Giờ làm việc: 8h - 20h hàng ngày
- Chính sách: Đổi trả trong 7 ngày, giao hàng miễn phí cho đơn trên 200.000₫

${productsContext}

Hướng dẫn trả lời:
- Khi khách hỏi về sản phẩm, hãy gợi ý các sản phẩm phù hợp từ danh sách trên
- Trình bày thông tin sản phẩm một cách hấp dẫn, nhấn mạnh ưu điểm và giá cả
- Nếu không có sản phẩm phù hợp trong danh sách, hãy đề nghị khách tìm kiếm trên website hoặc liên hệ hotline
- Hãy trả lời một cách thân thiện, ngắn gọn và hữu ích
- Nếu không chắc chắn, hãy đề nghị khách hàng liên hệ hotline: 0332653962`;

    // Xây dựng lịch sử hội thoại
    const history = [];

    // Thêm lịch sử hội thoại (giới hạn 10 tin nhắn gần nhất để tránh quá dài)
    const recentHistory = conversationHistory.slice(-10);

    // Đảm bảo lịch sử bắt đầu bằng tin nhắn từ user (yêu cầu của Gemini API)
    let filteredHistory = recentHistory;
    if (filteredHistory.length > 0 && filteredHistory[0].role !== "user") {
      // Nếu tin nhắn đầu tiên không phải từ user, bỏ qua nó
      filteredHistory = filteredHistory.slice(1);
    }

    // Xây dựng history với định dạng đúng cho Gemini API
    // Đảm bảo xen kẽ user-model và không có 2 tin nhắn liên tiếp cùng role
    let lastRole = null;
    for (const msg of filteredHistory) {
      const role = msg.role === "user" ? "user" : "model";

      // Bỏ qua nếu có 2 tin nhắn liên tiếp cùng role
      if (lastRole === role) {
        continue;
      }

      history.push({
        role: role,
        parts: [{ text: msg.content }],
      });

      lastRole = role;
    }

    // Danh sách model để thử (theo thứ tự ưu tiên)
    let modelNames = [];

    // Nếu có available models, chỉ sử dụng các model từ danh sách đó
    if (availableModels.length > 0) {
      // Lọc các model phù hợp (loại bỏ embedding và image-generation)
      const suitableModels = availableModels.filter(
        (m) =>
          m.startsWith("gemini-") &&
          !m.includes("embedding") &&
          !m.includes("image-generation")
      );

      // Sắp xếp theo thứ tự ưu tiên: flash trước (nhanh hơn), sau đó pro
      modelNames = suitableModels.sort((a, b) => {
        // Ưu tiên flash trước pro
        const aIsFlash = a.includes("flash");
        const bIsFlash = b.includes("flash");
        if (aIsFlash && !bIsFlash) return -1;
        if (!aIsFlash && bIsFlash) return 1;

        // Trong cùng loại, ưu tiên version mới hơn (số lớn hơn)
        const aVersion = a.match(/[\d.]+/)?.[0] || "0";
        const bVersion = b.match(/[\d.]+/)?.[0] || "0";
        return parseFloat(bVersion) - parseFloat(aVersion);
      });

      console.log("✅ Using models from available list:", modelNames);
    } else {
      // Nếu không lấy được available models, sử dụng danh sách mặc định
      modelNames = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
      ];
      console.warn(
        "⚠️ Không thể lấy danh sách models, sử dụng danh sách mặc định"
      );
    }

    let lastError = null;
    let text = null;
    let successfulModel = null;

    // Thử từng model cho đến khi tìm được model hoạt động
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction, // Sử dụng systemInstruction thay vì đưa vào history
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        // Tạo chat session với history (không bao gồm system instruction nữa)
        const chat = model.startChat({
          history: history,
        });

        // Gửi tin nhắn và nhận phản hồi
        const result = await chat.sendMessage(message);
        const response = await result.response;
        text = response.text();

        successfulModel = modelName;
        console.log(`✅ Đã sử dụng model thành công: ${modelName}`);
        break; // Nếu thành công, thoát khỏi vòng lặp
      } catch (error) {
        lastError = error;
        // Chỉ log warning nếu không phải lỗi 404 (để tránh spam log)
        if (!error.message?.includes("404")) {
          console.warn(
            `Model ${modelName} không khả dụng: ${error.message}. Thử model tiếp theo...`
          );
        }
        continue;
      }
    }

    // Nếu không có model nào hoạt động
    if (!text) {
      const errorMessage = `Không thể sử dụng bất kỳ model nào. 
Lỗi cuối cùng: ${lastError?.message || "Unknown error"}
API Key: ${process.env.GEMINI_API_KEY ? "Đã cấu hình" : "Chưa cấu hình"}
Available models: ${
        availableModels.length > 0
          ? availableModels.slice(0, 5).join(", ")
          : "Không thể lấy danh sách"
      }`;

      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    res.status(200).json({
      ok: true,
      response: text,
      products: relevantProducts.length > 0 ? relevantProducts : undefined, // Trả về sản phẩm nếu có
    });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({
      ok: false,
      message: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
