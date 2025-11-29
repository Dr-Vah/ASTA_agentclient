import { Phase, Role } from '../types';
// Helper to generate initial players
const generatePlayers = () => {
    const roles = [
        Role.WEREWOLF, Role.WEREWOLF, Role.WEREWOLF,
        Role.VILLAGER, Role.VILLAGER, Role.VILLAGER,
        Role.SEER, Role.WITCH, Role.HUNTER
    ];
    // Shuffle roles (simple shuffle)
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return Array.from({ length: 9 }, (_, i) => ({
        id: i + 1,
        name: i === 0 ? "You (Human)" : `Agent-${100 + i}`, // ID 1 is human for demo
        isAlive: true,
        role: roles[i], // In real game, this is hidden unless God mode
        isHuman: i === 0,
        suspicionScore: 0,
        avatarUrl: `https://picsum.photos/seed/${i + 50}/100/100`
    }));
};
// Initial State
let currentState = {
    day: 1,
    phase: Phase.DAY_ANNOUNCE,
    players: generatePlayers(),
    logs: [],
    timeLeft: 30,
    winner: null,
    selfId: 1,
    sheriffId: null,
};
let intervalId = null;
const listeners = new Set();
export const subscribeToGame = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};
const broadcast = () => {
    listeners.forEach(l => l({ ...currentState }));
};
const addLog = (content, type, speakerId) => {
    const newLog = {
        id: Math.random().toString(36).substring(7),
        day: currentState.day,
        phase: currentState.phase,
        speakerId,
        content,
        type,
        timestamp: Date.now()
    };
    currentState.logs = [...currentState.logs, newLog];
};
// Simulation Logic
export const startGameLoop = () => {
    if (intervalId)
        return;
    addLog("Game Initialized. Day 1 begins.", "system");
    intervalId = setInterval(() => {
        if (currentState.winner) {
            clearInterval(intervalId);
            return;
        }
        currentState.timeLeft -= 1;
        if (currentState.timeLeft <= 0) {
            advancePhase();
        }
        // Random AI chatter during discussion
        if (currentState.phase === Phase.DAY_DISCUSS && Math.random() > 0.8) {
            const aliveAgents = currentState.players.filter(p => p.isAlive && !p.isHuman);
            if (aliveAgents.length > 0) {
                const speaker = aliveAgents[Math.floor(Math.random() * aliveAgents.length)];
                const phrases = [
                    "I suspect Player 5 is acting suspiciously quiet.",
                    "My logic dictates Player 2 is a Villager.",
                    "I agree with the previous statement.",
                    "Can we focus on the voting patterns?",
                    "I am a Villager, please trust me."
                ];
                addLog(phrases[Math.floor(Math.random() * phrases.length)], "speech", speaker.id);
            }
        }
        broadcast();
    }, 1000);
};
const advancePhase = () => {
    let nextPhase = currentState.phase;
    let resetTime = 10;
    switch (currentState.phase) {
        case Phase.NIGHT_WOLF:
            addLog("Dawn breaks. The village wakes up.", "system");
            nextPhase = Phase.DAY_ANNOUNCE;
            resetTime = 5;
            break;
        case Phase.DAY_ANNOUNCE:
            addLog("Last night was a peaceful night (Mock).", "system");
            nextPhase = Phase.DAY_DISCUSS;
            resetTime = 30; // Discussion time
            break;
        case Phase.DAY_DISCUSS:
            addLog("Discussion ends. Please cast your votes.", "alert");
            nextPhase = Phase.DAY_VOTE;
            resetTime = 15;
            break;
        case Phase.DAY_VOTE:
            // Simulate a vote outcome
            const victimIndex = currentState.players.findIndex(p => p.isAlive && Math.random() > 0.5);
            if (victimIndex !== -1) {
                currentState.players[victimIndex].isAlive = false;
                addLog(`Player ${currentState.players[victimIndex].id} was voted out!`, "alert");
            }
            else {
                addLog("No one was voted out.", "system");
            }
            nextPhase = Phase.NIGHT_WOLF;
            addLog("Night falls. Wolves are hunting...", "system");
            currentState.day += 1;
            resetTime = 10;
            break;
        default:
            nextPhase = Phase.DAY_ANNOUNCE;
    }
    currentState.phase = nextPhase;
    currentState.timeLeft = resetTime;
    broadcast();
};
export const resetGame = () => {
    clearInterval(intervalId);
    intervalId = null;
    currentState = {
        day: 1,
        phase: Phase.DAY_ANNOUNCE,
        players: generatePlayers(),
        logs: [],
        timeLeft: 30,
        winner: null,
        selfId: 1,
        sheriffId: null,
    };
    broadcast();
};
export const sendHumanAction = (decision) => {
    // Log the speech
    if (decision.natural_speech) {
        addLog(decision.natural_speech, "speech", 1);
    }
    // Log the vote/action for visual confirmation in testing
    if (decision.vote_target) {
        addLog(`(Mock Backend) Received vote against Player ${decision.vote_target}`, "action", 1);
    }
    // In a real app, this would send POST to the python backend
    console.log("Human Action Sent:", decision);
};
export const getInitialState = () => currentState;
