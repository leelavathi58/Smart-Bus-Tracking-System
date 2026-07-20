
import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chatService";
import "../css/chatWidget.css";

function ChatWidget() {

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        if (isOpen && messages.length === 0) {

            setMessages([
                {
                    sender: "bot",
                    text: "Hi! 👋 I can help you navigate the Smart Bus Tracking System. Ask me anything about tracking buses, profile settings, passwords, or using app features."
                }
            ]);

        }

    }, [isOpen]);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const handleSend = async () => {

        if (!input.trim())
            return;

        const userMessage = input;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setInput("");

        setLoading(true);

        try {

            const reply = await sendMessage(userMessage);

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: reply
                }
            ]);

        }
        catch {

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: "Sorry, I couldn't reach the AI assistant."
                }
            ]);

        }

        setLoading(false);

    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            handleSend();

        }

    };

    return (
        <>
            <button
                className="chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className="bi bi-chat-dots-fill"></i>
            </button>

            {isOpen && (

                <div className="chat-window">

                    <div className="chat-header">

                        <span>
                            🤖 AI Assistant
                        </span>

                        <button
                            className="chat-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>

                    </div>

                    <div className="chat-body">

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={`chat-message ${msg.sender}`}
                            >
                                {msg.text}
                            </div>

                        ))}

                        {loading && (

                            <div className="chat-message bot">

                                ...

                            </div>

                        )}

                        <div ref={messagesEndRef}></div>

                    </div>

                    <div className="chat-footer">

                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button onClick={handleSend}>

                            <i className="bi bi-send-fill"></i>

                        </button>

                    </div>

                </div>

            )}
        </>
    );
}

export default ChatWidget;