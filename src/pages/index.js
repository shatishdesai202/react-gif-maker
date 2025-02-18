import { useState } from "react";
import { createGIF } from "gifshot";

export default function Home() {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [gifPreview, setGifPreview] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const uploadedImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        uploadedImages.push(reader.result);
        if (uploadedImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...uploadedImages]);
        }
      };
    });
  };

  const handleCreateGIF = () => {
    if (images.length === 0) {
      alert("Please upload images first.");
      return;
    }

    const options = {
      images: images,
      gifWidth: 500,
      gifHeight: 300,
      numWorkers: 5,
      frameDuration: 0.9,
      sampleInterval: 10,
      progressCallback: (e) => setProgress(parseInt(e * 100)),
    };

    createGIF(options, (obj) => {
      if (!obj.error) {
        setGifPreview(obj.image);
        setProgress(0);
      }
    });
  };

  const handleDownload = () => {
    if (!gifPreview) return;

    const link = document.createElement("a");
    link.download = "generated.gif";
    link.href = gifPreview;
    link.click();
  };

  return (
    <div className="App">
      <h3>Upload images to create a GIF</h3>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: 10 }}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Uploaded ${index}`}
            width={100}
            height={100}
            style={{ margin: 5 }}
          />
        ))}
      </div>

      <button onClick={handleCreateGIF} disabled={images.length === 0}>
        Create GIF
      </button>

      {gifPreview && (
        <div style={{ marginTop: 20 }}>
          <h4>Preview GIF</h4>
          <img src={gifPreview} alt="GIF Preview" width={500} />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={handleDownload} disabled={!gifPreview}>
          Download GIF
        </button>
      </div>

      {progress !== 0 && <label>Creating GIF... {progress}%</label>}
    </div>
  );
}
