"use client";
import { useState, useEffect } from "react";
import { saveChat, getChats } from "../lib/storage";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    product: "",
    description: "",
    audience: "",
  });

  useEffect(() => {
    setChats(getChats());
  }, []);

  const newChat = () => {
    const chat = {
      id: Date.now(),
      title: "New Campaign",
      date: new Date().toDateString(),
      messages: [],
    };

    setActiveChat(chat);
    setChats((prev) => [chat, ...prev]);
  };

  const formatContent = (text) => {
    if (!text) return "";

    return text
      .replace(/\*\*/g, "")
      .replace(/Hook:/gi, "\n🔥 HOOK:\n")
      .replace(/Caption:/gi, "\n📝 CAPTION:\n")
      .replace(/CTA:/gi, "\n👉 CTA:\n")
      .replace(/Hashtags:/gi, "\n#️⃣ HASHTAGS:\n")
      .replace(/\n/g, "<br/>");
  };

  const generate = async (e) => {
    e?.preventDefault();

    let chatRef = activeChat;

    if (!chatRef) {
      chatRef = {
        id: Date.now(),
        title: "New Campaign",
        date: new Date().toDateString(),
        messages: [],
      };

      setActiveChat(chatRef);
      setChats((prev) => [chatRef, ...prev]);
    }

    setLoading(true);

    const userMsg = {
      role: "user",
      content: `${input.product} | ${input.description}`,
    };

    try {
      const res = await fetch("/api/generate-text", {
        method: "POST",
        body: JSON.stringify(input),
      });

      const data = await res.json();

      const aiMsg = {
        role: "ai",
        content: formatContent(data.text),
        image: "/fallback_cake.png",
      };

      const updatedChat = {
        ...chatRef,
        title: input.product || "Campaign",
        messages: [...chatRef.messages, userMsg, aiMsg],
      };

      saveChat(updatedChat);
      setChats(getChats());
      setActiveChat(updatedChat);

    } catch (err) {
      console.error(err);
      alert("Error occurred");
    }

    setLoading(false);
  };

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const deleteChat = (id) => {
    const updated = chats.filter((chat) => chat.id !== id);

    setChats(updated);
    localStorage.setItem("chats", JSON.stringify(updated));

    if (activeChat?.id === id) {
      setActiveChat(null);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <button className="new-chat" onClick={newChat}>
          + New Campaign
        </button>

        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* SELECT CHAT */}
            <span
              onClick={() => setActiveChat(chat)}
              style={{ cursor: "pointer" }}
            >
              {chat.title}
            </span>

            {/* DELETE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 FIX BUG
                deleteChat(chat.id);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="header">MarketMind 🚀</div>

        <div className="chat">
          {activeChat?.messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="bubble">
                <div
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                {msg.image && <img src={msg.image} />}
              </div>
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            placeholder="Product"
            onChange={(e) =>
              setInput({ ...input, product: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
          />
          <input
            placeholder="Audience"
            onChange={(e) =>
              setInput({ ...input, audience: e.target.value })
            }
          />

          <button type="button" onClick={generate}>
            {loading ? "Generating..." : "Generate 🚀"}
          </button>
        </div>

      </div>
    </div>
  );
}