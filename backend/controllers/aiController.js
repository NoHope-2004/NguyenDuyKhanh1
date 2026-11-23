// System prompt định hướng chuyên môn cho AI tư vấn VLXD Hub
const SYSTEM_INSTRUCTION = `Bạn là trợ lý tư vấn vật liệu xây dựng của VLXD Hub. Trả lời bằng tiếng Việt, dễ hiểu, ngắn gọn và tập trung vào thông tin vật liệu xây dựng. Không tự bịa giá bán, tồn kho hoặc thông số của cửa hàng. Không đưa ra kết luận về thiết kế kết cấu chịu lực hoặc an toàn công trình. Nếu không chắc chắn, hãy nói rõ giới hạn thông tin. Không sử dụng emoji không cần thiết.`;

// Tri thức dự phòng khi chưa cấu hình GEMINI_API_KEY hoặc khi API hết quota
const KNOWLEDGE_FALLBACK = [
  {
    keywords: ['pcb40', 'xi măng'],
    reply: 'Xi măng PCB40 (Poóc lăng hỗn hợp) là loại xi măng có độ chịu nén tối thiểu 40 N/mm2 sau 28 ngày đóng rắn. Thường được sử dụng để đổ bê tông móng, dầm, cột, sàn các công trình nhà ở dân dụng hoặc công nghiệp đòi hỏi cường độ cao và đông kết ổn định.',
  },
  {
    keywords: ['gạch xây', 'gạch 4 lỗ', 'gạch đinh'],
    reply: 'Các loại gạch xây phổ biến gồm: 1) Gạch tuynel 4 lỗ: nhẹ, cách nhiệt tốt, chuyên xây tường ngăn phòng. 2) Gạch đinh đặc: chịu nén tốt, chống thấm cao, chuyên xây móng, hố ga, chân tường. 3) Gạch bê tông nhẹ (AAC): cách âm, chống nóng tốt, giảm tải trọng công trình.',
  },
  {
    keywords: ['sơn nội thất', 'sơn ngoại thất', 'sơn'],
    reply: 'Sơn nội thất chú trọng độ mịn màng, an toàn sức khỏe, dễ lau chùi vết bẩn trong nhà. Sơn ngoại thất được bổ sung phụ gia đặc biệt để chống tia UV, kháng kiềm, chống thấm nước mưa và chống rêu mốc trước thời tiết khắc nghiệt ngoài trời.',
  },
  {
    keywords: ['cát vàng', 'cát đen', 'cát'],
    reply: 'Cát vàng hạt lớn (mô đun > 2.0) có độ góc cạnh và chịu lực tốt, chuyên dùng cho công tác đổ bê tông kết cấu dầm sàn. Cát hạt mịn (cát xây tô) sạch tạp chất, giúp vữa trát tường phẳng, mịn màng và không bị nứt chân chim.',
  },
  {
    keywords: ['sửa nhà', 'vật liệu sửa nhà', 'cải tạo'],
    reply: 'Khi sửa nhà, các vật liệu cơ bản cần chuẩn bị gồm: xi măng xây tô, cát xây tô sạch, gạch ốp lát mới kèm keo dán gạch chống thấm, sơn nước nội ngoại thất, bột bả làm phẳng tường và ống nước thay mới đường ống cũ.',
  },
  {
    keywords: ['chống thấm', 'sika', 'kova'],
    reply: 'Vật liệu chống thấm (như Sika Latex hay Kova CT-11A) tạo lớp màng ngăn nước thẩm thấu vào mao dẫn bê tông. Cần thiết thi công ở khu vực ẩm ướt như sàn nhà vệ sinh, ban công, seno thoát nước, sê-nô và sân thượng.',
  },
];

// @desc    Hỏi đáp tư vấn vật liệu xây dựng
// @route   POST /api/ai/chat
// @access  Public
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Vui lòng nhập câu hỏi của bạn' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`\n[AI LOG] Nhận câu hỏi: "${message}"`);
    console.log(`[AI LOG] Trạng thái API Key: ${apiKey ? 'ĐÃ CÓ KEY (' + apiKey.slice(0, 8) + '...)' : 'CHƯA CÓ KEY (ĐANG RỖNG)'}`);

    // Nếu có API Key, gọi trực tiếp Gemini API
    if (apiKey && apiKey.trim() !== '') {
      const candidateModels = [
        'gemini-2.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-flash-latest',
        'gemini-2.5-pro',
      ];

      for (const model of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nNgười dùng hỏi: ${message}` }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.5,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              console.log(`[AI LOG] 🌟 GOOGLE GEMINI (${model}) TRẢ LỜI THÀNH CÔNG!`);
              console.log(`[AI LOG] Nội dung: "${reply.slice(0, 100)}..."\n`);
              return res.status(200).json({
                reply: reply.trim(),
                source: 'GEMINI_AI',
              });
            }
          } else {
            console.warn(`[AI LOG] Model ${model} trả về HTTP ${response.status}, đang thử model tiếp theo...`);
          }
        } catch (geminiError) {
          console.warn(`[AI LOG] Lỗi khi gọi ${model}:`, geminiError.message);
        }
      }
    }

    // Xử lý bằng hệ thống tri thức chuyên ngành VLXD dự phòng
    console.log(`\n[AI LOG] ℹ️ Đang kích hoạt Bộ tri thức chuyên gia dự phòng cho câu hỏi: "${message}"\n`);
    const lowerMsg = message.toLowerCase();
    const matched = KNOWLEDGE_FALLBACK.find((item) =>
      item.keywords.some((kw) => lowerMsg.includes(kw))
    );

    if (matched) {
      return res.status(200).json({
        reply: matched.reply,
        source: 'FALLBACK',
      });
    }

    // Trả lời mặc định chuẩn kỹ thuật xây dựng
    return res.status(200).json({
      reply:
        'Về câu hỏi "' +
        message +
        '", VLXD Hub khuyên bạn nên tham khảo tiêu chuẩn kỹ thuật của nhà sản xuất hoặc liên hệ kỹ sư giám sát công trình để có thông số chính xác nhất với thực tế thi công. Chúng tôi cung cấp đầy đủ các danh mục xi măng, sắt thép, gạch đá và phụ kiện chính hãng.',
      source: 'FALLBACK',
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xử lý phản hồi từ AI: ' + error.message });
  }
};

module.exports = {
  chatWithAI,
};
