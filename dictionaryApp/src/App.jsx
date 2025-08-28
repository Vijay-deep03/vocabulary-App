import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { Search, WholeWord, Linkedin } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import RingLoader from "react-spinners/RingLoader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button2 from "./Button";

const App = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check user's preferred color scheme or use light as default
    return (
      localStorage.getItem("darkMode") === "true" ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Apply dark mode class on initial render
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load search history from localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    try {
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
      setSearchHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
    } catch (e) {
      setSearchHistory([]);
      localStorage.removeItem("searchHistory");
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [darkMode, searchHistory]);

  const changeBgColor = () => {
    const inputBox = document.querySelector(".input");
    if (inputBox) {
      inputBox.style.borderColor = "#1BD0FE";
    }
  };

  const resetColor = () => {
    const inputBox = document.querySelector(".input");
    if (inputBox) {
      inputBox.style.borderColor = darkMode ? "#374151" : "#e5e7eb";
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyBWzTfgPJDkv-uhSERLSgR3HLDPKDxpyYE",
  });

  async function getResult() {
    if (!word.trim()) return;

    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Considered you are a dictionary AI. we will give to a word and you need to Give all the dictionary details in good form 
        including examples also, Meanings, Definitions, Synonyms , Phonetics etc The Word is ${word}`,
      });
      setResult(response.text);

      // Add to search history
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== word);
        return [word, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
        onHistoryItemClick={(word) => {
          setWord(word);
          // Optionally trigger search automatically:
          // getResult();
        }}
        onBookmarkItemClick={(word) => {
          setWord(word);
          // Optionally trigger search automatically:
          // getResult();
        }}
        currentWord={word} // Pass the current word to Navbar
      />
      <div
        className={`searchContainer mt-[5px] px-[250px] ${
          darkMode ? "dark:bg-gray-900" : "bg-gray-90"
        }`}
      >
        <div
          className={`inputBox ${
            darkMode
              ? "dark:bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border rounded-lg flex items-center`}
        >
          <input
            className={`input ${
              darkMode
                ? "dark:bg-gray-800 dark:text-white"
                : "bg-white text-gray-800"
            } w-full py-3 px-4 outline-none`}
            onKeyUp={(e) => e.key === "Enter" && getResult()}
            onChange={(e) => setWord(e.target.value)}
            value={word}
            type="text"
            onBlur={resetColor}
            onFocus={changeBgColor}
            placeholder="Type a word . . . . ."
          />
          <Search
            color="#1BD0FE" // Keep consistent teal color in both modes
            className="mr-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (word.trim()) {
                // Only search if there's text
                getResult();
              }
            }}
          />
        </div>
      </div>

      <div
        className={`resultContainer pl-[20px] mt-5 mb-3 min-h-[65vh] mx-[250px] ${
          darkMode
            ? "dark:bg-gray-900 dark:text-white"
            : "bg-white text-gray-800"
        } rounded-lg`}
        style={{
          borderTop: "2px solid #1BD0FE",
          borderBottom: "2px solid #1BD0FE",
        }}
      >
        {loading ? (
          <div className="absolute mt-30 inset-0 flex justify-center items-center">
            <RingLoader color="#1BD0FE" size={100} />
          </div>
        ) : (
          <>
            {!result && (
              <div className="flex justify-center items-center mt-60 text-gray-400 dark:text-gray-500">
                Search Your Word <WholeWord className="ml-2" />
              </div>
            )}
            {result && (
              <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
            )}
          </>
        )}
      </div>

      <div
        className={`footer flex items-center justify-end h-[80px] ${
          darkMode ? "dark:bg-gray-800" : "bg-[#1F2937]"
        }`}
      >
        <p className="text-white ">
          Made by <span className="text-sky-300"> - </span>
          <span className=" cursor-pointer">
            <a
              className="mr-2"
              href="https://www.linkedin.com/in/vijay-deep-77aa64270/ "
            >
              Vijaydeep
            </a>
          </span>
        </p>
        <a
          href="https://www.linkedin.com/in/vijay-deep-77aa64270/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-300 hover:text-sky-400 transition-colors duration-200 cursor-pointer"
        >
          <Button2 />
        </a>
      </div>
    </div>
  );
};

export default App;
