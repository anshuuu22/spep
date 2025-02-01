import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = "https://anshuuu22.onrender.com"; // Replace this with your backend URL

function App() {
  const [file, setFile] = useState(null);
  const [intensityData, setIntensityData] = useState([]);
  const [graphUrl, setGraphUrl] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadImage = async () => {
    if (!file) return alert("Please select an image.");
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
      const filename = response.data.filename;
      fetchIntensity(filename);
      fetchGraph(filename);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const fetchIntensity = async (filename) => {
    try {
      const response = await axios.get(`${API_URL}/process/${filename}`);
      setIntensityData(response.data.intensity_values);
    } catch (error) {
      console.error("Error fetching intensity data", error);
    }
  };

  const fetchGraph = (filename) => {
    setGraphUrl(`${API_URL}/graph/${filename}`);
  };

  return (
    <div className="container">
      <h1>Densitometer</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload & Process</button>

      {intensityData.length > 0 && (
        <div>
          <h2>Intensity Graph</h2>
          <Line
            data={{
              labels: intensityData.map((_, i) => i),
              datasets: [
                {
                  label: "Pixel Density",
                  data: intensityData,
                  borderColor: "blue",
                  fill: false,
                },
              ],
            }}
          />
        </div>
      )}

      {graphUrl && (
        <div>
          <h2>Processed Graph</h2>
          <img src={graphUrl} alt="Densitometry Graph" />
        </div>
      )}
    </div>
  );
}

export default App;
