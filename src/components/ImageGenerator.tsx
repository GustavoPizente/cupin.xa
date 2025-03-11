import { useState } from "react";
import axios from "axios";


const PG_API_TOKEN  = process.env.PG_API_TOKEN


const translateText = async (text: string) => {
  try {
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    return response.data[0][0][0] || text;
  } catch (error) {
    console.error("Erro na tradução:", error);
    return text; // Se falhar, mantém o texto original
  }
};

const ImageGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const translatedText = await translateText(prompt);
      const finalPrompt = `${translatedText} made of fine wood`;

      console.log("Prompt final:", finalPrompt);

      const ImagePig = require("imagepig");
      const imagepig = ImagePig(PG_API_TOKEN);
      const result = await imagepig.default(finalPrompt);

      setImage(result.url); // Usa a URL retornada pela API
    } catch (err: any) {
      setError("Erro ao gerar a imagem. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;

    const a = document.createElement("a");
    a.href = image;
    a.download = "imagem_gerada.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="main">
      <h2>Precisando de inspirações?</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Digite o que gostaria de ver..."
      />
      <button onClick={fetchImage} disabled={loading}>
        {loading ? "Gerando..." : "Gerar Imagem"}
      </button>

      {loading && <p>Gerando... demora mas vai!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {image && (
        <img src={image} className="generatedImage" alt="Imagem Gerada" />
      )}

      <button onClick={downloadImage} disabled={!image}>
        Baixar Imagem
      </button>
    </div>
  );
};

export default ImageGenerator;
