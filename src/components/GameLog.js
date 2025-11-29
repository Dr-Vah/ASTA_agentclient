import React, { useEffect, useRef } from 'react';
import { Terminal, MessageSquare, Zap, AlertTriangle } from 'lucide-react';
const LogItem = ({ log }) => {
    const getIcon = () => {
        switch (log.type) {
            case 'speech': return React.createElement(MessageSquare, { className: "w-4 h-4 text-cyber-accent" });
            case 'action': return React.createElement(Zap, { className: "w-4 h-4 text-cyber-warning" });
            case 'alert': return React.createElement(AlertTriangle, { className: "w-4 h-4 text-cyber-danger" });
            default: return React.createElement(Terminal, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getColor = () => {
        switch (log.type) {
            case 'speech': return 'text-gray-200';
            case 'action': return 'text-cyber-warning';
            case 'alert': return 'text-cyber-danger font-bold';
            default: return 'text-gray-400 italic';
        }
    };
    return (React.createElement("div", { className: "flex gap-3 mb-3 text-sm animate-fade-in" },
        React.createElement("div", { className: "mt-0.5 opacity-70 shrink-0" }, getIcon()),
        React.createElement("div", { className: "flex-1" },
            React.createElement("div", { className: "flex items-center gap-2 mb-0.5" },
                log.speakerId && (React.createElement("span", { className: "font-mono text-cyber-accent text-xs bg-cyber-800 px-1 rounded" },
                    "Player ",
                    log.speakerId)),
                React.createElement("span", { className: "text-[10px] text-gray-600 font-mono uppercase" },
                    log.phase.replace('_', ' '),
                    " \u2022 ",
                    new Date(log.timestamp).toLocaleTimeString([], { hour12: false }))),
            React.createElement("p", { className: `${getColor()} leading-relaxed` }, log.content))));
};
const GameLog = ({ logs }) => {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    return (React.createElement("div", { className: "flex flex-col h-full glass-panel rounded-xl overflow-hidden" },
        React.createElement("div", { className: "bg-cyber-800/50 px-4 py-3 border-b border-white/5 flex items-center gap-2" },
            React.createElement(Terminal, { className: "w-4 h-4 text-cyber-accent" }),
            React.createElement("h3", { className: "font-mono text-sm font-bold tracking-wider text-gray-300" }, "TERMINAL LOGS")),
        React.createElement("div", { className: "flex-1 overflow-y-auto p-4 scrollbar-hide bg-cyber-900/30" },
            logs.length === 0 && (React.createElement("div", { className: "text-center text-gray-600 mt-10 italic" }, "Waiting for game stream...")),
            logs.map((log) => (React.createElement(LogItem, { key: log.id, log: log }))),
            React.createElement("div", { ref: bottomRef }))));
};
export default GameLog;
