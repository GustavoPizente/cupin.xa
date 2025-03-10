import { useState, useEffect } from "react";
import axios from "axios";

const HF_API_TOKEN = process.env.REACT_APP_HF_API_TOKEN;
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const ImageGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    console.log("Token carregado:", HF_API_TOKEN);

    
    
    // Gera uma imagem automaticamente ao montar o componente
    fetchImage();
  }, []);

  const fetchImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      // Criar uma URL para exibir a imagem gerada
      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    } catch (err: any) {
      setError("Erro ao gerar a imagem. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div  className="main">
      <h2>Precisando de inspirações? </h2>
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
      {image && <img src={image}  className="generatedImage" alt="Imagem Gerada" />}
    </div>
  );
};

export default ImageGenerator;
