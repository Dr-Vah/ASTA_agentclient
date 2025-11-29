import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Play, Film, Eye, Cpu, Users } from 'lucide-react';
import { startGameLoop, subscribeToGame, sendHumanAction, getInitialState, resetGame } from './services/mockGameEngine';
import PlayerCard from './components/PlayerCard';
import GameLog from './components/GameLog';
import ActionPanel from './components/ActionPanel';
import StatsChart from './components/StatsChart';
// --- Layout Component ---
const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    return (React.createElement("div", { className: "min-h-screen bg-cyber-900 text-gray-100 font-sans selection:bg-cyber-accent selection:text-white flex flex-col" },
        React.createElement("header", { className: "border-b border-white/10 bg-cyber-900/80 backdrop-blur-md sticky top-0 z-50" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate('/') },
                    React.createElement("div", { className: "w-8 h-8 bg-gradient-to-br from-cyber-accent to-cyber-purple rounded-lg flex items-center justify-center" },
                        React.createElement(Cpu, { className: "text-white w-5 h-5" })),
                    React.createElement("div", null,
                        React.createElement("h1", { className: "font-bold text-lg tracking-tight leading-none" }, "CORE vs DARK TIDE"),
                        React.createElement("p", { className: "text-[10px] text-cyber-accent font-mono tracking-wider" }, "AI WEREWOLF ARENA"))),
                React.createElement("nav", { className: "flex gap-1 bg-cyber-800/50 p-1 rounded-lg" },
                    React.createElement("button", { onClick: () => navigate('/'), className: `px-4 py-1.5 rounded text-xs font-medium transition-colors ${isActive('/') ? 'bg-cyber-700 text-white' : 'text-gray-400 hover:text-white'}` }, "LOBBY"),
                    React.createElement("button", { onClick: () => navigate('/arena'), className: `px-4 py-1.5 rounded text-xs font-medium transition-colors ${isActive('/arena') ? 'bg-cyber-700 text-white' : 'text-gray-400 hover:text-white'}` }, "ARENA")))),
        React.createElement("main", { className: "flex-1 flex flex-col" }, children)));
};
// --- Lobby Page ---
const Lobby = () => {
    const navigate = useNavigate();
    const modes = [
        {
            title: "SPECTATOR MODE",
            desc: "Watch top-tier AI agents battle in real-time.",
            icon: React.createElement(Eye, { className: "w-8 h-8 mb-4 text-cyber-accent" }),
            action: () => { resetGame(); startGameLoop(); navigate('/arena?mode=spectator'); }
        },
        {
            title: "REPLAY ANALYSIS",
            desc: "Review historical matches with full state inspection.",
            icon: React.createElement(Film, { className: "w-8 h-8 mb-4 text-cyber-purple" }),
            action: () => { resetGame(); navigate('/arena?mode=replay'); }
        },
        {
            title: "HUMAN CHALLENGE",
            desc: "Join the lobby as Player 1 and face the AI.",
            icon: React.createElement(Users, { className: "w-8 h-8 mb-4 text-cyber-success" }),
            action: () => { resetGame(); startGameLoop(); navigate('/arena?mode=human'); }
        }
    ];
    return (React.createElement("div", { className: "flex-1 flex items-center justify-center p-6 relative overflow-hidden" },
        React.createElement("div", { className: "absolute inset-0 overflow-hidden pointer-events-none" },
            React.createElement("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl animate-pulse-slow" }),
            React.createElement("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-pulse-slow", style: { animationDelay: '1.5s' } })),
        React.createElement("div", { className: "max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10" }, modes.map((mode, i) => (React.createElement("div", { key: i, onClick: mode.action, className: "group glass-panel p-8 rounded-2xl border border-white/5 hover:border-cyber-accent/50 cursor-pointer transition-all duration-300 hover:-translate-y-1" },
            React.createElement("div", { className: "bg-cyber-800/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyber-800 transition-colors" }, mode.icon),
            React.createElement("h2", { className: "text-xl font-bold text-white mb-2 font-mono" }, mode.title),
            React.createElement("p", { className: "text-gray-400 text-sm leading-relaxed" }, mode.desc),
            React.createElement("div", { className: "mt-6 flex items-center text-cyber-accent text-xs font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" },
                "INITIALIZE ",
                React.createElement(Activity, { className: "w-3 h-3 ml-2" }))))))));
};
// --- Arena Page ---
const Arena = () => {
    const [gameState, setGameState] = useState(getInitialState());
    const [godMode, setGodMode] = useState(false);
    const location = useLocation();
    // Parse query param for mode
    const mode = new URLSearchParams(location.search).get('mode') || 'spectator';
    const isReplay = mode === 'replay';
    useEffect(() => {
        const unsubscribe = subscribeToGame((newState) => {
            setGameState(newState);
        });
        return () => {
            // ensure the cleanup returns void even if unsubscribe() returns a boolean
            void unsubscribe();
        };
    }, []);
    // Determine Grid Layout for 9 Players
    // Visualizing as a 3x3 grid or circle. Let's do a specialized layout.
    // Top: 3, Middle: 3 (Left, Center-Table, Right), Bottom: 3
    const renderPlayerGrid = () => {
        // Mapping specific indices to create a "seated" feel
        const topRow = gameState.players.slice(3, 6); // 4,5,6
        const midRowLeft = gameState.players[2]; // 3
        const midRowRight = gameState.players[6]; // 7
        const bottomRow = [gameState.players[1], gameState.players[0], gameState.players[8], gameState.players[7]].slice(0, 3); // 2,1,9 (using simplified logic for demo)
        // Actually, simpler loop is better for robustness
        return (React.createElement("div", { className: "grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto aspect-square p-4 relative" },
            React.createElement("div", { className: "absolute inset-0 m-auto w-1/2 h-1/2 bg-cyber-800/30 rounded-full border border-white/5 flex flex-col items-center justify-center z-0 pointer-events-none backdrop-blur-sm" },
                React.createElement("div", { className: "text-3xl font-bold font-mono text-cyber-accent tracking-widest" },
                    "DAY ",
                    gameState.day),
                React.createElement("div", { className: "text-xs text-cyber-warning mt-1 uppercase tracking-wider" }, gameState.phase.replace('_', ' ')),
                React.createElement("div", { className: "mt-4 text-4xl font-mono font-light text-white" },
                    gameState.timeLeft,
                    "s")),
            gameState.players.map((player) => (React.createElement("div", { key: player.id, className: "flex items-center justify-center z-10" },
                React.createElement(PlayerCard, { player: player, isGodMode: godMode || mode === 'spectator' }))))));
    };
    return (React.createElement("div", { className: "flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]" },
        React.createElement("div", { className: "flex-[2] p-4 flex flex-col relative bg-gradient-to-b from-transparent to-cyber-900/50" },
            React.createElement("div", { className: "absolute top-4 left-4 z-20 flex gap-2" },
                React.createElement("button", { onClick: () => setGodMode(!godMode), className: `px-3 py-1 rounded text-xs font-mono border ${godMode ? 'bg-cyber-accent text-cyber-900 border-cyber-accent' : 'bg-transparent text-gray-400 border-gray-700'}` }, godMode ? 'GOD_VIEW: ON' : 'GOD_VIEW: OFF'),
                isReplay && (React.createElement("div", { className: "flex gap-1 bg-cyber-800 rounded px-2 items-center" },
                    React.createElement(Play, { className: "w-3 h-3 text-green-400" }),
                    React.createElement("span", { className: "text-xs text-gray-300 font-mono" }, "REPLAYING...")))),
            React.createElement("div", { className: "flex-1 flex items-center justify-center overflow-y-auto" }, renderPlayerGrid())),
        React.createElement("div", { className: "flex-1 lg:max-w-md bg-cyber-800/20 border-l border-white/5 flex flex-col h-full" },
            React.createElement("div", { className: "h-1/3 p-4 border-b border-white/5" }, mode === 'human' ? (React.createElement(ActionPanel, { gameState: gameState, onAction: sendHumanAction })) : (React.createElement(StatsChart, { players: gameState.players }))),
            React.createElement("div", { className: "flex-1 p-4 min-h-0" },
                React.createElement(GameLog, { logs: gameState.logs })))));
};
// --- Main App ---
const App = () => {
    return (React.createElement(HashRouter, null,
        React.createElement(Layout, null,
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Lobby, null) }),
                React.createElement(Route, { path: "/arena", element: React.createElement(Arena, null) })))));
};
export default App;
