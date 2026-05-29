import { GoogleGenAI } from "@google/genai";
import type { IncomingMessage, ServerResponse } from "http";

function checkIsPlaceholderKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  return !apiKey || 
    apiKey === 'placeholder' || 
    apiKey.includes('YOUR_') || 
    apiKey.includes('your-') || 
    apiKey.length < 15;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-vercel',
      }
    }
  });
}

// Custom simple keyword-based stream fallback
async function streamFallbackResponse(res: ServerResponse, message: string, keyIssue: boolean = false) {
  const isIndo = /halo|hai|resep|bagaimana|cara|simpan|suka|makanan|kue|rasa/i.test(message) || !/[a-zA-Z]/i.test(message);
  
  let responseText = "";
  const msgLower = message.toLowerCase();

  const warningHeader = keyIssue 
    ? (isIndo 
        ? `> ⚠️ **Catatan Kitchen Cloud**: Kunci API Gemini Anda terkonfigurasi tetapi tidak merespons (mungkin salah format atau mencapai limit kuota). Chef Sweetie akan mengocok adonan resep secara lokal untuk Anda! 🧁✨\n\n`
        : `> ⚠️ **Kitchen Cloud Note**: Your Gemini API key is configured but returned an error (it might be invalid or hit quota limits). Chef Sweetie is whipping up local recipes for you! 🧁✨\n\n`)
    : (isIndo
        ? `> 💡 **Mode Demo Chef Sweetie**: Saat ini berjalan dalam **Mode Offline Lokal** karena kunci API Gemini belum dikonfigurasi di Settings > Secrets. Masukkan kunci nyata untuk obrolan AI yang sepenuhnya pintar! 💖🍰\n\n`
        : `> 💡 **Chef Sweetie Demo Mode**: Running in **Local Offline Mode** as the Gemini API key is not set in Settings > Secrets. Connect a real key to unlock full smart AI capabilities! 💖🍰\n\n`);

  if (msgLower.includes("strawberry") || msgLower.includes("cloud") || msgLower.includes("dream") || msgLower.includes("stroberi")) {
    responseText = isIndo 
      ? `### Strawberry Cloud Dream Cake 🍰✨\n\nWah, pilihan yang luar biasa! Sponge cake stroberi kami sangat disukai karena teksturnya yang selembut awan. \n\n**Tips Khusus dari Chef Sweetie:**\n- **Suhu Bahan:** Pastikan telur berada pada suhu ruang sebelum dikocok. Ini membantu adonan sponge mengembang maksimal!\n- **Krim Kocok:** Gunakan krim dingin dan wadah logam yang didinginkan agar krim mengembang kaku dengan sempurna.\n\nKamu bisa melihat resep lengkapnya dan memberikan tanda ❤️ di kartu resepnya, lho! 🍓`
      : `### Strawberry Cloud Dream Cake 🍰✨\n\nWhat a delightful choice! Our Strawberry Cloud Sponge cake is famous for its cloud-like softness.\n\n**Chef Sweetie's Baker Tip:**\n- **Egg Temperature:** Make sure eggs are at room temperature before whipping. This helps the sponge batter rise beautifully!\n- **Whipping Cream:** Keep your cream ice-cold and use a pre-chilled metal bowl to achieve perfect stiff peaks.\n\nYou can view the full recipe steps and click ❤️ directly on our recipe card! 🍓`;
  } else if (msgLower.includes("velvet") || msgLower.includes("pink") || msgLower.includes("donut") || msgLower.includes("donat")) {
    responseText = isIndo
      ? `### Velvet Pink Glazed Donuts 🍩✨\n\nDonat merah jambu kami yang diinfus dengan bit alami ini sangat lezat dan estetik! \n\n**Tips Khusus dari Chef Sweetie:**\n- **Ragi Aktif:** Selalu tes ragi Anda dalam air hangat suam-suam kuku dengan sedikit gula. Jika tidak berbusa setelah 5 menit, ganti yang baru!\n- **Suhu Goreng:** Goreng pada suhu minyak stabil 175°C (350°F) agar donat matang merata tanpa menyerap minyak berlebih.\n\nJangan lupa beri tanda bookmark 🔖 untuk menyimpannya di profilmu! 🥯`
      : `### Velvet Pink Glazed Donuts 🍩✨\n\nOur natural beetroot-infused pink glazed donuts are as delicious as they are aesthetic!\n\n**Chef Sweetie's Baker Tip:**\n- **Yeast Proofing:** Always proof your yeast in lukewarm water with a pinch of sugar. If it doesn't foam in 5 minutes, replace it!\n- **Frying Temp:** Maintain a steady oil temperature of 175°C (350°F) so the donuts cook evenly without absorbing too much grease.\n\nRemember to hit the bookmark 🔖 icon on its card to save it to your profile! 🥯`;
  } else if (msgLower.includes("brownie") || msgLower.includes("chocolate") || msgLower.includes("cokelat") || msgLower.includes("choco")) {
    responseText = isIndo
      ? `### Double Choco Brownie Box 🍫🧁\n\nAh, brownies legendaris! Teksturnya sangat padat (*fudgy*) dan kaya rasa cokelat.\n\n**Tips Khusus dari Chef Sweetie:**\n- **Mentega Hangat:** Campurkan gula saat mengocok mentega yang masih hangat-hangat kuku. Ini membantu gula larut dan menghasilkan lapisan tipis berkilau (*shiny crust*) khas brownies premium.\n- **Suhu Oven:** Jangan overbake! Brownies akan terus memadat saat mendingin di luar oven.\n\nBeri tanda ❤️ jika kamu sangat menyukai cokelat! 🥳`
      : `### Double Choco Brownie Box 🍫🧁\n\nAh, the legendary brownies! Incredibly rich, fudgy, and packed with dark chocolate.\n\n**Chef Sweetie's Baker Tip:**\n- **Warm Butter:** Whisk the sugar with lukewarm melted butter. This dissolves the sugar slightly, giving you that beautiful shiny crackly crust!\n- **No Overbaking:** Pull them out when a toothpick comes out with a few wet crumbs. They keep firming up as they cool.\n\nClick ❤️ if you are a chocoholic! 🥳`;
  } else if (msgLower.includes("bento") || msgLower.includes("korean") || msgLower.includes("korea") || msgLower.includes("mini")) {
    responseText = isIndo
      ? `### Korean Bento Mini Cake 🎂🌸\n\nTrendi, imut, dan sangat estetik! Kue dalam kotak makan siang ini sangat mudah dikreasikan.\n\n**Tips Khusus dari Chef Sweetie:**\n- **Frosting:** Gunakan buttercream berbasis mentega berkualitas tinggi untuk hasil dekorasi yang halus dan kokoh.\n- **Warna Pastel:** Tambahkan pewarna makanan gel sedikit saja menggunakan tusuk gigi untuk menghasilkan warna pastel yang lembut.\n\nBeritahu Chef jika bingung memilih dekorasi buttercream-nya ya! ✨`
      : `### Korean Bento Mini Cake 🎂🌸\n\nTrendy, cute, and highly customizable! These lunchbox cakes are extremely fun to style.\n\n**Chef Sweetie's Baker Tip:**\n- **Frosting:** Use high-quality butter for your buttercream to achieve a smooth, stable piping texture.\n- **Pastel Colors:** Use gel food coloring sparingly on a toothpick to get those gorgeous, dreamy pastel shades.\n\nLet me know if you need help planning your design! ✨`;
  } else if (msgLower.includes("macaron") || msgLower.includes("lavender") || msgLower.includes("lemon")) {
    responseText = isIndo
      ? `### Lavender Macaron Towers 🗼💜\n\nKue Prancis legendaris dengan aroma lavender manis dan ganache madu lemon yang segar.\n\n**Tips Khusus dari Chef Sweetie:**\n- **Kulit Kering:** Biarkan macarons yang sudah dicetak berdiam selama 30-45 menit hingga permukaannya kering dan tidak lengket disentuh sebelum dipanggang. Ini wajib garansi mengeluarkan "kaki" macaron yang indah!\n- **Tepung Almond Saring:** Selalu saring tepung almond dan gula halus minimal 2 kali agar permukaannya mulus berkilau.\n\nKamu bisa mencoba resep sulit ini secara perlahan-laman ya! 👩‍🍳`
      : `### Lavender Macaron Towers 🗼💜\n\nLegendary French macarons with beautiful lavender-scented shells and a bright lemon-honey ganache.\n\n**Chef Sweetie's Baker Tip:**\n- **Drying Stage:** Let the piped shells rest for 30-45 minutes until a dull skin forms. It shouldn't stick to your finger. This is crucial for forming the macaron "feet"!\n- **Sifting:** Sift almond flour and powdered sugar twice to ensure smooth, glossy, bump-free shells.\n\nTake your time with this hard recipe, you can do it! 👩‍🍳`;
  } else if (msgLower.includes("matcha") || msgLower.includes("green tea") || msgLower.includes("teh hijau") || msgLower.includes("muffin")) {
    responseText = isIndo
      ? `### Matcha Green Tea Swirls 🍵🧁\n\nMuffin matcha lembut dengan kejutan white chocolate yang meleleh di dalamnya.\n\n**Tips Khusus dari Chef Sweetie:**\n- **Jangan Overmix:** Saat mencampur bahan basah dan kering, aduk pelan saja asal tercampur rata. Adonan yang terlalu banyak diaduk akan membuat muffin menjadi keras dan bantat!\n- **Kualitas Matcha:** Gunakan bubuk matcha kualitas seremonial atau kuliner Jepang terbaik untuk aroma otentik.\n\nSangat cocok ditemani secangkir teh hangat di sore hari! ☕`
      : `### Matcha Green Tea Swirls 🍵🧁\n\nMoist matcha muffins with a sweet white chocolate swirl inside.\n\n**Chef Sweetie's Baker Tip:**\n- **Do Not Overmix:** Stir the wet and dry ingredients just until combined. Overmixing results in dense, tough muffins!\n- **Matcha Grade:** Use premium Japanese culinary or ceremonial grade matcha for the best flavor and vibrant green color.\n\nPerfect when paired with a hot cup of tea! ☕`;
  } else if (msgLower.includes("cheesecake") || msgLower.includes("souffle") || msgLower.includes("keju")) {
    responseText = isIndo
      ? `### Fluffy Cloud Cheesecake ☁️🧀\n\nJapanese Soufflé Cheesecake yang mengembang tinggi dan super bergoyang saat digerakkan.\n\n**Tips Khusus dari Chef Sweetie:**\n- **Teknik Water Bath (Bain-Marie):** Panggang panci kue di dalam loyang berisi air panas. Ini menjaga suhu tetap merata dan mencegah permukaan cheesecake retak.\n- **Kocokan Putih Telur:** Kocok putih telur hingga tahap *soft peaks* saja. Jika terlalu kaku, kue akan mengembang terlalu cepat lalu kempes drastis saat keluar oven.\n\nDukung Chef dengan memberikan bookmark 🔖 pada resep menakjubkan ini ya! ✨`
      : `### Fluffy Cloud Cheesecake ☁️🧀\n\nJapanese Souffle Cheesecake that rises tall and jiggles like a soft sponge!\n\n**Chef Sweetie's Baker Tip:**\n- **Water Bath (Bain-Marie):** Bake the cake pan inside a tray filled with hot water. This regulates the oven moisture and prevents the top from cracking.\n- **Egg Whites:** Whip the whites until soft peaks only. If whipped to stiff peaks, the cake expands too rapidly and collapses when cooling.\n\nShow some love by bookmarking 🔖 this brilliant recipe! ✨`;
  } else {
    responseText = isIndo
      ? `Halo! Aku **Chef Sweetie**, asisten kue AI pribadimu di SweetTreats! 🍰✨\n\nSelamat datang di dapur interaktif kami. Aku bisa membantumu memberikan tips rahasia memanggang, baking science, serta rekomendasi resep terbaik!\n\n**Menu Masakan Unggulan SweetTreats Hari Ini:**\n1. 🍓 **Strawberry Cloud Dream Cake** (Tingkat: Sedang)\n2. 🍩 **Velvet Pink Glazed Donuts** (Tingkat: Sulit)\n3. 🍫 **Double Choco Brownie Box** (Tingkat: Mudah)\n4. 🎂 **Korean Bento Mini Cake** (Tingkat: Sedang)\n5. 🗼 **Lavender Macaron Towers** (Tingkat: Sulit)\n6. 🍵 **Matcha Green Tea Swirls** (Tingkat: Mudah)\n7. ☁️ **Fluffy Cloud Cheesecake** (Tingkat: Sedang)\n\nSilakan tanyakan nama resep atau tips kue di atas untuk memulai obrolan kue yang manis! 🧁✨`
      : `Hello! I am **Chef Sweetie**, your personal baking companion here at SweetTreats! 🍰✨\n\nWelcome to our sweet interactive bakery. I can provide professional baking guidelines, science behind baking ingredients, and specific recipe advice!\n\n**Our Chef-Pick Menu Today:**\n1. 🍓 **Strawberry Cloud Dream Cake** (Medium)\n2. 🍩 **Velvet Pink Glazed Donuts** (Hard)\n3. 🍫 **Double Choco Brownie Box** (Easy)\n4. 🎂 **Korean Bento Mini Cake** (Medium)\n5. 🗼 **Lavender Macaron Towers** (Hard)\n6. 🍵 **Matcha Green Tea Swirls** (Easy)\n7. ☁️ **Fluffy Cloud Cheesecake** (Medium)\n\nAsk me about any recipe above, or any general baking query (like oven temperatures, yeast tricks, etc.) to start cooking together! 🧁✨`;
  }

  const finalMessage = warningHeader + responseText;
  const words = finalMessage.split(" ");
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i === words.length - 1 ? "" : " ");
    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 8));
  }
}

// Handler helper to read stream of request body safely
function getRequestBody(req: IncomingMessage): Promise<any> {
  if ((req as any).body !== undefined) {
    const rawBody = (req as any).body;
    return Promise.resolve(typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody);
  }
  // If the stream is already not readable, resolve immediately to prevent hanging
  if (!req.readable || req.complete) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
    // Add a safety timeout so it never hangs infinitely
    setTimeout(() => {
      resolve({});
    }, 10000);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // ONLY allow POST requests
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  // Set headers for Server-Sent Events (SSE) streaming immediately
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  try {
    const body = await getRequestBody(req);
    const { message, history = [] } = body;

    if (!message) {
      res.write(`data: ${JSON.stringify({ error: "Message is required" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    const isPlaceholder = checkIsPlaceholderKey();
    if (isPlaceholder) {
      await streamFallbackResponse(res, message, false);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (clientErr) {
      await streamFallbackResponse(res, message, true);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    // Format history for Gemini SDK
    const contents = [
      ...history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are 'Chef Sweetie', the ultra-fast, professional, and super friendly AI head baker of SweetTreats. 
Your goal is to provide concise, delightful, extremely accurate, and professional baking advice.

Important Context:
- SweetTreats currently features these amazing recipes:
  1. Strawberry Cloud Dream Cake (Sponge cake, strawberries, cream, 45 mins, Medium)
  2. Velvet Pink Glazed Donuts (Yeast, beetroot-infused pink glaze, fried, 90 mins, Hard)
  3. Double Choco Brownie Box (Dark chocolate, cocoa powder, butter, eggs, 30 mins, Easy)
  4. Korean Bento Mini Cake (Aesthetic pastel lunchbox cakes with buttercream, 60 mins, Medium)
  5. Lavender Macaron Towers (Lavender-scented shells with honey-lemon ganache, 120 mins, Hard)
  6. Matcha Green Tea Swirls (Matcha muffins with white chocolate, 25 mins, Easy)
  7. Fluffy Cloud Cheesecake (Airy Japanese-style souffle cheesecake, 240 mins, Medium)
  
Rules:
- Always suggest recipes from this list if the user asks for recommendations of cake, donuts, brownies, macarons, cheesecake, etc.
- Provide general baking science, high-quality baking tips, and detailed instructions if they ask about other recipes.
- If someone mentions "simpan" (save) or "suka" (like), remind them that they can click the heart ❤️ (like) or bookmark 🔖 (save) icon directly on each recipe card!
- Keep answers brief, tidy, and beautifully formatted with Markdown, utilizing bullets and bold text.
- Spread love and high energy with emojis: 🍰, ✨, 🧁, 🍪, 🍩, 🥐.
- ALWAYS respond in the same language as the user (default to Indonesian if the user writes in Indonesian, e.g. "Halo Chef!").`,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
    } catch (geminiApiErr: any) {
      console.error("Gemini Content Stream failed, falling back gracefully:", geminiApiErr);
      await streamFallbackResponse(res, message, true);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    console.error("Chat API Error:", error);
    try {
      res.write(`data: ${JSON.stringify({ error: error.message || "Internal stream error" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (e) {
      // Safe check
    }
  }
}
