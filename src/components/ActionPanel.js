import React, { useState } from 'react';
import { Phase } from '../types';
import { Send, Microscope } from 'lucide-react';
const ActionPanel = ({ gameState, onAction }) => {
    const [speech, setSpeech] = useState('');
    const [target, setTarget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isTurn = gameState.players.find(p => p.id === gameState.selfId)?.isAlive;
    const canSpeak = gameState.phase === Phase.DAY_DISCUSS || gameState.phase === Phase.DAY_ANNOUNCE;
    const canVote = gameState.phase === Phase.DAY_VOTE;
    // In a real implementation, we would check roles for Night phases
    const handleSubmit = () => {
        if (!speech && !target)
            return;
        setIsSubmitting(true);
        // Mock "Think" delay
        setTimeout(() => {
            onAction({
                natural_speech: speech,
                vote_target: target ? parseInt(target) : undefined,
                reasoning_steps: ["User input received", "Processing strategy..."],
                suspicion_scores: {}
            });
            setSpeech('');
            setTarget('');
            setIsSubmitting(false);
        }, 500);
    };
    if (!isTurn) {
        return (React.createElement("div", { className: "glass-panel p-6 rounded-xl text-center h-full flex items-center justify-center" },
            React.createElement("p", { className: "text-gray-500 font-mono" }, "You are spectating (or dead).")));
    }
    return (React.createElement("div", { className: "glass-panel p-4 rounded-xl h-full flex flex-col" },
        React.createElement("h3", { className: "font-mono text-sm font-bold text-cyber-accent mb-4 flex items-center gap-2" },
            React.createElement(Microscope, { className: "w-4 h-4" }),
            "DECISION MODULE"),
        React.createElement("div", { className: "flex-1 space-y-4" },
            React.createElement("div", { className: `space-y-2 ${!canSpeak ? 'opacity-50 pointer-events-none' : ''}` },
                React.createElement("label", { className: "text-xs text-gray-400 font-mono" }, "NATURAL_SPEECH_OUTPUT"),
                React.createElement("textarea", { value: speech, onChange: (e) => setSpeech(e.target.value), placeholder: canSpeak ? "Enter your argument..." : "Waiting for discussion phase...", className: "w-full bg-cyber-900/50 border border-cyber-700 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent h-24 resize-none font-mono" })),
            React.createElement("div", { className: `space-y-2 ${!canVote ? 'opacity-50 pointer-events-none' : ''}` },
                React.createElement("label", { className: "text-xs text-gray-400 font-mono" }, "TARGET_SELECTION (ID)"),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement("select", { value: target, onChange: (e) => setTarget(e.target.value), className: "bg-cyber-900/50 border border-cyber-700 rounded-lg p-2 text-sm text-gray-200 flex-1 focus:outline-none focus:border-cyber-accent" },
                        React.createElement("option", { value: "" }, "Select Player ID..."),
                        gameState.players.map(p => (React.createElement("option", { key: p.id, value: p.id, disabled: !p.isAlive || p.id === gameState.selfId },
                            "Player ",
                            p.id,
                            " ",
                            p.isAlive ? '' : '(Dead)'))))))),
        React.createElement("button", { onClick: handleSubmit, disabled: isSubmitting || (!canSpeak && !canVote), className: `
            mt-4 w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
            ${isSubmitting || (!canSpeak && !canVote)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-cyber-accent text-cyber-900 hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]'}
        ` }, isSubmitting ? 'TRANSMITTING...' : (React.createElement(React.Fragment, null,
            React.createElement(Send, { className: "w-4 h-4" }),
            " COMMIT DECISION")))));
};
export default ActionPanel;
