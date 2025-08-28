import React, { useState, useEffect } from "react";
import {Book,History,Bookmark,Moon,Sun,X,Trash2,Star,Menu,} from "lucide-react";

const Navbar = ({darkMode,toggleDarkMode,searchHistory = [],setSearchHistory,onHistoryItemClick = () => {},
onBookmarkItemClick = () => {},currentWord = "",
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarks(Array.isArray(parsedBookmarks) ? parsedBookmarks : []);
      } catch (e) {
        setBookmarks([]);
        localStorage.removeItem("bookmarks");
      }
    }
  }, []);

  // Check if current word is bookmarked whenever it changes
  useEffect(() => {
    if (currentWord) {
      const isBooked = bookmarks.some(
        (bookmark) => bookmark.word === currentWord
      );
      setIsBookmarked(isBooked);
    } else {
      setIsBookmarked(false);
    }
  }, [currentWord, bookmarks]);

  const handleBookmarkClick = () => {
    setShowBookmarks(!showBookmarks);
    setShowHistory(false);
  };

  const toggleBookmark = () => {
    if (!currentWord) return;

    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter(
        (bookmark) => bookmark.word !== currentWord
      );
      setBookmarks(updatedBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
    } else {
      // Add bookmark
      const newBookmark = {
        word: currentWord,
        date: new Date().toISOString(),
      };
      const updatedBookmarks = [newBookmark, ...bookmarks];
      setBookmarks(updatedBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleBookmarkItemClick = (word) => {
    onBookmarkItemClick(word);
    setShowBookmarks(false);
    setMobileMenuOpen(false);
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem("bookmarks");
    setShowBookmarks(false);
    if (currentWord) {
      setIsBookmarked(false);
    }
  };

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      } catch (e) {
        setSearchHistory([]);
        localStorage.removeItem("searchHistory");
      }
    }
  }, [setSearchHistory]);

  const handleHistoryClick = () => {
    setShowHistory(!showHistory);
    setShowBookmarks(false);
  };

  const handleHistoryItemClick = (word) => {
    onHistoryItemClick(word);
    setShowHistory(false);
    setMobileMenuOpen(false);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    setShowHistory(false);
  };

  return (
    <div className="navbar px-4 sm:px-6 lg:px-[250px] flex items-center justify-between h-[80px] md:h-[100px] border-gray-200 dark:border-[#4B5563] dark:bg-gray-900 relative">
      {/* Logo */}
      <div
        className="logo flex items-center gap-1 cursor-pointer"
        onClick={() => window.location.reload()}
      >
        <Book size={32} className="md:size-[40px]" color="#1BD0FE" />
        <h3 className="text-xl md:text-[25px] font-[600] dark:text-white">
          ᕓ<span className="text-sky-300">ₒ</span>C
          <span className="text-sky-300">ₐ</span>B
          <span className="text-sky-300">ᵤₗₐᵣ</span>Y
          <span className="text-yellow-400 font-bold"> ⮞</span>
          <span className="text-sky-300 ml-1.5 text-sm md:text-base">Λɪ</span>
        </h3>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={28} />
      </button>

      {/* Icons - Desktop */}
      <div className="hidden md:flex items-center gap-4 lg:gap-[20px]">
        <NavIcons
          isBookmarked={isBookmarked}
          currentWord={currentWord}
          toggleBookmark={toggleBookmark}
          bookmarks={bookmarks}
          showBookmarks={showBookmarks}
          handleBookmarkClick={handleBookmarkClick}
          handleBookmarkItemClick={handleBookmarkItemClick}
          handleClearBookmarks={handleClearBookmarks}
          searchHistory={searchHistory}
          showHistory={showHistory}
          handleHistoryClick={handleHistoryClick}
          handleHistoryItemClick={handleHistoryItemClick}
          handleClearHistory={handleClearHistory}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg z-50 border border-t-0 border-gray-200 dark:border-gray-700">
          <div className="p-4 flex flex-col gap-4">
            <MobileNavItem
              icon={<Star size={24} fill={isBookmarked ? "#f59e0b" : "none"} />}
              label={isBookmarked ? "Remove Bookmark" : "Bookmark Current"}
              onClick={toggleBookmark}
              disabled={!currentWord}
            />

            <MobileNavItem
              icon={
                <Bookmark
                  size={24}
                  fill={bookmarks.length > 0 ? "#f59e0b" : "none"}
                />
              }
              label="Bookmarks"
              onClick={handleBookmarkClick}
              hasDropdown={showBookmarks}
            />

            {showBookmarks && (
              <MobileDropdown
                items={bookmarks}
                onItemClick={handleBookmarkItemClick}
                onClear={handleClearBookmarks}
                emptyMessage="No bookmarks yet"
                renderItem={(bookmark) => (
                  <>
                    <Star size={14} fill="#f59e0b" className="flex-shrink-0" />
                    <span className="truncate">{bookmark.word}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(bookmark.date).toLocaleDateString()}
                    </span>
                  </>
                )}
              />
            )}

            <MobileNavItem
              icon={<History size={24} />}
              label="History"
              onClick={handleHistoryClick}
              hasDropdown={showHistory}
            />

            {showHistory && (
              <MobileDropdown
                items={searchHistory}
                onItemClick={handleHistoryItemClick}
                onClear={handleClearHistory}
                emptyMessage="No search history yet"
                renderItem={(word) => (
                  <>
                    <span className="truncate">{word}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                )}
              />
            )}

            <MobileNavItem
              icon={
                darkMode ? (
                  <Sun size={24} className="text-yellow-400" />
                ) : (
                  <Moon size={24} />
                )
              }
              label={darkMode ? "Light Mode" : "Dark Mode"}
              onClick={toggleDarkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable component for desktop icons
const NavIcons = ({isBookmarked,currentWord,toggleBookmark,bookmarks,showBookmarks,handleBookmarkClick,
  handleBookmarkItemClick,handleClearBookmarks,searchHistory,showHistory,handleHistoryClick,
  handleHistoryItemClick,handleClearHistory,darkMode,toggleDarkMode,
}) => {
  return (
    <>
      {/* Bookmark Current Word Button */}
      <button
        onClick={toggleBookmark}
        className={`cursor-pointer p-2 rounded-full transition-all ${
          isBookmarked ? "text-yellow-400" : "text-gray-400 dark:text-gray-500"
        } hover:bg-gray-100 dark:hover:bg-gray-700`}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        disabled={!currentWord}
      >
        <Star size={28} fill={isBookmarked ? "currentColor" : "none"} />
      </button>

      {/* Bookmarks Dropdown Button */}
      <div className="relative">
        <button
          onClick={handleBookmarkClick}
          className="cursor-pointer p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Show bookmarks"
        >
          <Bookmark
            size={28}
            fill={bookmarks.length > 0 ? "#f59e0b" : "none"}
          />
        </button>

        {/* Bookmarks Dropdown */}
        {showBookmarks && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Bookmark size={18} fill="#f59e0b" />
                Bookmarks
              </h3>
              <button
                onClick={() => handleBookmarkClick(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close bookmarks"
              >
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {bookmarks.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-y-auto">
                {bookmarks.map((bookmark, index) => (
                  <li key={`${bookmark.word}-${index}`} className="group">
                    <button
                      onClick={() => handleBookmarkItemClick(bookmark.word)}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/80 transition-colors duration-150 flex items-center justify-between group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    >
                      <span className="truncate flex items-center gap-2">
                        <Star
                          size={14}
                          fill="#f59e0b"
                          className="flex-shrink-0"
                        />
                        {bookmark.word}
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 ml-2">
                        {new Date(bookmark.date).toLocaleDateString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <Bookmark size={24} className="mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No bookmarks yet
                </p>
              </div>
            )}

            {bookmarks.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                <button
                  onClick={handleClearBookmarks}
                  className="w-full py-2 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Clear All Bookmarks
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Dropdown Button */}
      <div className="relative">
        <button
          onClick={handleHistoryClick}
          className="cursor-pointer p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Show search history"
        >
          <History size={28} />
        </button>

        {/* History Dropdown */}
        {showHistory && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <History size={18} />
                Search History
              </h3>
              <button
                onClick={() => handleHistoryClick(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close history"
              >
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {searchHistory.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-y-auto">
                {searchHistory.map((word, index) => (
                  <li key={`${word}-${index}`} className="group">
                    <button
                      onClick={() => handleHistoryItemClick(word)}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/80 transition-colors duration-150 flex items-center justify-between group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    >
                      <span className="truncate">{word}</span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 ml-2">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <History size={24} className="mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No search history yet
                </p>
              </div>
            )}

            {searchHistory.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                <button
                  onClick={handleClearHistory}
                  className="w-full py-2 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Clear All History
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="cursor-pointer p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun size={28} className="text-yellow-400" />
        ) : (
          <Moon size={28} />
        )}
      </button>
    </>
  );
};

// Reusable component for mobile menu items
const MobileNavItem = ({ icon, label, onClick, disabled, hasDropdown }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        disabled
          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <span className="font-medium">{label}</span>
      {hasDropdown && (
        <span className="ml-auto text-gray-400 dark:text-gray-500">
          {hasDropdown ? "▲" : "▼"}
        </span>
      )}
    </button>
  );
};

// Reusable component for mobile dropdowns
const MobileDropdown = ({
  items,
  onItemClick,
  onClear,
  emptyMessage,
  renderItem,
}) => {
  return (
    <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
      {items.length > 0 ? (
        <>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <li key={index}> 
                <button
                  onClick={() => onItemClick(item.word || item)}
                  className="w-full text-left p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                >
                  {renderItem(item)}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClear}
            className="w-full mt-2 p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center gap-1 text-sm"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </>
      ) : (
        <div className="p-2 text-gray-500 dark:text-gray-400 text-sm">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};
export default Navbar;
