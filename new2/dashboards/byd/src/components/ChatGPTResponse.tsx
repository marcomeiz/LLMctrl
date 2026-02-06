'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

interface ChatGPTResponseProps {
  question: string;
  answer: string;
  onCopy: () => void;
  copied: boolean;
}

// ChatGPT logo SVG component
const ChatGPTLogo = () => (
  <svg width="24" height="24" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500528C16.1708 0.495003 14.0893 1.16065 12.3614 2.40399C10.6335 3.64734 9.34853 5.40566 8.69078 7.42695C7.30439 7.60552 5.97152 8.06498 4.77649 8.77461C3.58147 9.48424 2.55043 10.428 1.74935 11.5459C0.259518 13.6259 -0.293028 16.1898 0.218753 18.6589C0.730534 21.1279 2.26497 23.2922 4.47204 24.7026C4.02381 26.0492 3.86839 27.4759 4.01602 28.8874C4.16365 30.2989 4.61099 31.6625 5.32837 32.8871C6.39177 34.7393 8.01626 36.2057 9.96715 37.0748C11.918 37.9439 14.0946 38.1708 16.1829 37.7226C17.1248 38.784 18.2825 39.6321 19.5787 40.2099C20.8749 40.7878 22.2795 41.082 23.6986 41.0728C25.8423 41.0793 27.9311 40.4098 29.6614 39.1584C31.3916 37.907 32.6733 36.1384 33.3233 34.1081C34.7097 33.9295 36.0426 33.4701 37.2376 32.7604C38.4327 32.0508 39.4637 31.107 40.2648 29.9891C41.7535 27.909 42.3052 25.3458 41.7929 22.8774C41.2806 20.409 39.7466 18.2451 37.5324 16.8707ZM23.6984 37.8232C22.2541 37.8298 20.8429 37.3877 19.6536 36.556C19.6856 36.5378 19.7494 36.5017 19.7918 36.477L27.5278 31.9034C27.7395 31.7816 27.9148 31.6056 28.0361 31.3934C28.1574 31.1812 28.2205 30.9403 28.2193 30.6954V19.7814L31.4795 21.6652C31.4982 21.6747 31.514 21.6889 31.5253 21.7063C31.5365 21.7237 31.5428 21.7437 31.5434 21.7643V30.7793C31.5414 32.5818 30.8243 34.3097 29.5494 35.5843C28.2746 36.8588 26.5472 37.5754 24.7449 37.5771L23.6984 37.8232ZM6.39227 31.0064C5.66908 29.7959 5.31262 28.4058 5.36574 27.0004C5.39772 27.0228 5.45938 27.0648 5.50539 27.0942L13.2414 31.6677C13.4516 31.7911 13.6913 31.8565 13.9353 31.8565C14.1793 31.8565 14.419 31.7911 14.6292 31.6677L24.0134 26.2457V29.9794C24.0126 30.0001 24.0072 30.0204 23.9976 30.0386C23.988 30.0569 23.9744 30.0726 23.9579 30.0847L16.1428 34.7029C14.5851 35.6052 12.7594 35.9156 11.0008 35.5806C9.24222 35.2455 7.67227 34.2884 6.56877 32.8836L6.39227 31.0064ZM4.29707 13.6194C5.01653 12.4043 6.08776 11.4318 7.36938 10.8305C7.36938 10.8663 7.36574 10.9395 7.36574 10.9901V20.1374C7.36459 20.3818 7.42753 20.6222 7.54854 20.8343C7.66955 21.0463 7.84445 21.2223 8.05569 21.3443L17.4398 26.7663L14.1795 28.6501C14.1612 28.6617 14.1401 28.6684 14.1183 28.6695C14.0965 28.6706 14.0749 28.6662 14.0554 28.6565L6.24094 23.9946C4.68823 23.0869 3.50975 21.6591 2.9226 19.9706C2.33544 18.2821 2.37822 16.4455 3.04368 14.7845L4.29707 13.6194ZM33.6988 19.6554L24.3147 14.2334L27.575 12.3496C27.5932 12.338 27.6143 12.3314 27.6361 12.3302C27.6579 12.329 27.6795 12.3335 27.699 12.3432L35.5136 17.0051C36.6273 17.6495 37.5366 18.5876 38.145 19.7184C38.7534 20.8491 39.037 22.1286 38.9645 23.4129C38.892 24.6972 38.4662 25.9364 37.7354 26.9851C37.0046 28.0339 35.9981 28.8489 34.8301 29.3489V20.3619C34.8323 20.1174 34.7701 19.8767 34.6493 19.6645C34.5286 19.4523 34.3535 19.2763 34.1416 19.1554L33.6988 19.6554ZM36.9284 14.0053C36.8965 13.9829 36.8348 13.9409 36.7888 13.9115L29.0528 9.33799C28.8426 9.21462 28.6029 9.14924 28.3589 9.14924C28.1149 9.14924 27.8752 9.21462 27.665 9.33799L18.2809 14.76V11.0263C18.2801 11.0055 18.2841 10.9847 18.2926 10.9658C18.3011 10.9469 18.3139 10.9305 18.3299 10.9178L26.1451 6.30287C27.2601 5.65685 28.5301 5.32226 29.8202 5.33617C31.1103 5.35008 32.3727 5.71199 33.4731 6.38127C34.5735 7.05054 35.4722 7.99998 36.0779 9.13127C36.6837 10.2625 36.9742 11.5339 36.9195 12.8167L36.9284 14.0053ZM16.0749 21.2184L12.8147 19.3346C12.796 19.3251 12.7802 19.3109 12.7689 19.2935C12.7576 19.2761 12.7513 19.2561 12.7507 19.2355V10.2206C12.7532 8.93192 13.1072 7.66941 13.7739 6.56796C14.4406 5.4665 15.3947 4.56797 16.5349 3.97005C17.6751 3.37213 18.9599 3.09694 20.2472 3.17543C21.5344 3.25392 22.775 3.68302 23.8324 4.41576C23.8004 4.43399 23.7366 4.47006 23.6943 4.49484L15.9583 9.0684C15.7465 9.19017 15.5712 9.36615 15.4499 9.57836C15.3286 9.79056 15.2656 10.0315 15.2668 10.2763L16.0749 21.2184ZM18.2808 17.749L20.9999 16.1742L23.7191 17.7478V20.8971L20.9999 22.4706L18.2808 20.8971V17.749Z" fill="white"/>
  </svg>
);

// Thinking dots animation
const ThinkingDots = () => (
  <div className="flex items-center gap-1">
    <div className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
    <div className="h-2 w-2 animate-bounce rounded-full bg-text-muted" />
  </div>
);

export default function ChatGPTResponse({ question, answer, onCopy, copied }: ChatGPTResponseProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const hasStarted = useRef(false);

  // Intersection Observer to detect when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Start animation when visible
  useEffect(() => {
    if (!isVisible || hasStarted.current || hasAnimated.current) return;

    hasStarted.current = true;
    setShowThinking(true);
    setIsTyping(true);

    let typeInterval: NodeJS.Timeout;

    // Show thinking for 800ms
    const thinkingTimer = setTimeout(() => {
      setShowThinking(false);

      // Start typing animation
      let currentIndex = 0;
      const words = answer.split(' ');

      typeInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(words.slice(0, currentIndex + 1).join(' '));
          currentIndex++;

          // Auto-scroll to bottom during typing
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsComplete(true);
          hasAnimated.current = true;
        }
      }, 15); // Speed: 15ms per word
    }, 800);

    return () => {
      clearTimeout(thinkingTimer);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [isVisible, answer]);

  // Skip animation on click
  const skipAnimation = () => {
    if ((isTyping || showThinking) && !isComplete) {
      setDisplayedText(answer);
      setIsTyping(false);
      setShowThinking(false);
      setIsComplete(true);
      hasAnimated.current = true;
    }
  };

  return (
    <div ref={observerRef} className="flex flex-col rounded-2xl border border-border bg-[#212121] overflow-hidden">
      {/* ChatGPT Header */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-[#2f2f2f] px-4 py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10a37f]">
          <ChatGPTLogo />
        </div>
        <span className="text-sm font-medium text-white">ChatGPT</span>
        <span className="ml-auto text-xs text-gray-500">GPT-5.2</span>
      </div>

      {/* Chat messages container */}
      <div
        ref={containerRef}
        className="max-h-[500px] overflow-y-auto"
        onClick={skipAnimation}
      >
        {/* User message */}
        <div className="border-b border-border/30 bg-[#2f2f2f] px-4 py-6">
          <div className="mx-auto flex max-w-3xl gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <span className="text-sm font-semibold text-white">U</span>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-[15px] leading-relaxed text-white">{question}</p>
            </div>
          </div>
        </div>

        {/* ChatGPT response */}
        <div className="bg-[#212121] px-4 py-6">
          <div className="mx-auto flex max-w-3xl gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10a37f]">
              <ChatGPTLogo />
            </div>
            <div className="flex-1 pt-1">
              {showThinking ? (
                <ThinkingDots />
              ) : (
                <div className="text-[15px] leading-relaxed text-[#d1d5db]">
                  <p className="whitespace-pre-wrap">
                    {displayedText}
                    {isTyping && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white" />
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      {isComplete && (
        <div className="flex items-center gap-1 border-t border-border/30 bg-[#2f2f2f] px-4 py-2">
          <div className="mx-auto flex max-w-3xl w-full items-center gap-1">
            <div className="w-12" /> {/* Spacer for avatar alignment */}
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <ThumbsUp size={14} />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <ThumbsDown size={14} />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
