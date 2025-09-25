import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

export const createPayment = async (req, res) => {
  const { orderCode, amount } = req.body;
  var accessKey = process.env.MOMO_ACCESS_KEY;
  var secretKey = process.env.MOMO_SECRET_KEY;
  var orderInfo = "pay with MoMo";
  var partnerCode = process.env.MOMO_PARTNER_CODE;
  var redirectUrl = "http://localhost:3000/profile/orders";
  var ipnUrl = process.env.MOMO_IPN_URL;
  var requestType = "payWithMethod";
  var orderId = orderCode;
  var requestId = orderCode + "_" + Date.now(); // Tạo requestId unique
  var extraData = "";

  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  //option
  const option = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(option);
    return res.status(200).json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    console.log("error", error);
  }
  return res.status(200).json({
    ok: true,
  });
};

export const callbackPayment = async (req, res) => {
  console.log("callbackPayment", req.body);
  return res.status(200).json({
    ok: true,
    data: req.body,
  });
};

export const transactionStatus = async (req, res) => {
  const { orderId, requestId } = req.body;

  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const partnerCode = process.env.MOMO_PARTNER_CODE;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });
  const option = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(option);
    return res.status(200).json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const updateStatusPayment = async (req, res) => {
  const data = req.body;
  console.log("Đã nhận callback từ momo", data);
  if (data.resultCode === 0) {
    const order = await Order.findOne({ orderCode: data.orderId });
    if (order) {
      order.payment.status = "paid";
      await order.save();
    }
  }
  return res.status(200).json({
    ok: true,
    data: data,
  });
};
