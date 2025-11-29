import React from 'react';
import { Role } from '../types';
import { Skull, Crown } from 'lucide-react';
const RoleIcon = ({ role }) => {
    switch (role) {
        case Role.WEREWOLF: return React.createElement("span", { className: "text-cyber-danger text-xs font-bold" }, "WOLF");
        case Role.SEER: return React.createElement("span", { className: "text-cyber-purple text-xs font-bold" }, "SEER");
        case Role.WITCH: return React.createElement("span", { className: "text-pink-500 text-xs font-bold" }, "WITCH");
        case Role.HUNTER: return React.createElement("span", { className: "text-cyber-warning text-xs font-bold" }, "HUNT");
        default: return React.createElement("span", { className: "text-cyber-success text-xs font-bold" }, "VILL");
    }
};
const PlayerCard = ({ player, isGodMode, onClick }) => {
    // Only show role if God Mode, or Player is dead, or Player is Self, or Role is revealed
    const showRole = isGodMode || !player.isAlive || player.isHuman;
    return (React.createElement("div", { onClick: onClick, className: `
        relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${!player.isAlive ? 'opacity-50 grayscale border-gray-700' : 'border-cyber-700 hover:border-cyber-accent hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]'}
        ${player.isHuman ? 'ring-2 ring-cyber-accent ring-offset-2 ring-offset-cyber-900' : ''}
        w-24 h-32 sm:w-28 sm:h-36
      ` },
        React.createElement("div", { className: "absolute -top-2 -right-2 flex space-x-1" },
            !player.isAlive && React.createElement(Skull, { className: "w-5 h-5 text-gray-400 bg-cyber-900 rounded-full p-0.5" }),
            player.id === 2 && player.isAlive && React.createElement(Crown, { className: "w-5 h-5 text-yellow-400 bg-cyber-900 rounded-full p-0.5" })),
        React.createElement("div", { className: "relative w-14 h-14 sm:w-16 sm:h-16 mb-2" },
            React.createElement("img", { src: player.avatarUrl, alt: player.name, className: `w-full h-full rounded-full object-cover border-2 ${player.isAlive ? 'border-gray-500' : 'border-gray-800'}` }),
            React.createElement("div", { className: "absolute -bottom-1 -right-1 bg-cyber-800 text-white text-xs px-1.5 rounded border border-gray-600" }, player.id)),
        React.createElement("div", { className: "text-center w-full" },
            React.createElement("div", { className: "text-xs text-gray-300 truncate w-full px-1 font-mono mb-1" }, player.isHuman ? 'YOU' : `Bot-${player.id}`),
            React.createElement("div", { className: "h-4 flex items-center justify-center" }, showRole ? (React.createElement(RoleIcon, { role: player.role })) : (React.createElement("span", { className: "text-gray-600 text-[10px]" }, "???")))),
        player.isAlive && (React.createElement("div", { className: "absolute bottom-1 w-10/12 h-1 bg-cyber-800 rounded-full overflow-hidden mt-1" },
            React.createElement("div", { className: "h-full bg-cyber-danger transition-all duration-500", style: { width: `${Math.random() * 100}%` } })))));
};
export default PlayerCard;
