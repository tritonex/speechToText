import React, { useState } from "react";
import { Mic } from "lucide-react";

const VoiceSearch = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = async () => {
    try {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.lang = "de-DE";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        // Here you can process the text further as needed
        console.log("Recognized text:", transcript);
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Suche..."
        />
        <button
          onClick={startListening}
          className={`absolute right-2 p-2 rounded-full ${
            isListening ? "text-red-500" : "text-gray-500"
          } hover:bg-gray-100`}
        >
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("voice-search-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/VoiceSearch.js"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

export default VoiceSearch;
