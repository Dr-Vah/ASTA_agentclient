/*
  mockGameEngine.ts

  说明：
  - 本模块是前端内置的“模拟引擎”，用于本地演示与开发：生成玩家、推进阶段、制造日志、处理人类动作等。
  - 在真实比赛中，游戏状态由后端（比赛引擎）维护并通过网络推送（或被前端轮询 / websocket 订阅）。
  - 这里的逻辑简化了夜晚与白天流程，仅用于 UI 演示；关键责任包括：
      * 维护 `currentState` 并暴露订阅 API (`subscribeToGame`)；
      * 启动 / 重置游戏循环 (`startGameLoop` / `resetGame`)；
      * 接收人类操作接口 `sendHumanAction`（当前仅记录日志并打印）。
*/

import { GameState, Phase, Role, LogEntry, Player, AgentDecision, GameMeta } from '../types';

// Helper to generate initial players
const generatePlayers = (): Player[] => {
  // Default role distribution for a 9-player standard game.
  const roles = [
    Role.WEREWOLF, Role.WEREWOLF, Role.WEREWOLF,
    Role.VILLAGER, Role.VILLAGER, Role.VILLAGER,
    Role.SEER, Role.WITCH, Role.HUNTER
  ];
  
  // Shuffle roles so each run produces a different assignment.
  // This is a Fisher–Yates in-place shuffle.
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  // Create Player objects. Note: for demo we mark player 1 as human.
  // In a real match the role field would be hidden from clients (unless revealed).
  return Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: i === 0 ? "You (Human)" : `Agent-${100 + i}`, // ID 1 is human for demo
    isAlive: true,
    role: roles[i], // role is present in mock state; real client would not receive this unless authorized
    isHuman: i === 0,
    suspicionScore: 0,
    avatarUrl: `https://picsum.photos/seed/${i + 50}/100/100`
  }));
};

// >>> NEW FEATURE: Mock Data Generation for Game Lists (Spectator/Replay) <<<
const generateMockGames = (count: number, status: 'LIVE' | 'FINISHED'): GameMeta[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${status === 'LIVE' ? 'live' : 'rep'}-${1000 + i}`,
    title: status === 'LIVE' ? `Qualifier Group ${String.fromCharCode(65+i)}` : `Finals Match ${2024 - i}`,
    status: status,
    day: status === 'LIVE' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 4) + 3,
    players: Array.from({length: 9}, () => `Agent-${Math.floor(Math.random() * 900) + 100}`),
    winner: status === 'FINISHED' ? (Math.random() > 0.5 ? 'WEREWOLVES' : 'VILLAGERS') : undefined,
    timestamp: Date.now() - Math.floor(Math.random() * 10000000)
  }));
};

const mockActiveGames = generateMockGames(6, 'LIVE');
const mockReplays = generateMockGames(8, 'FINISHED');

// >>> NEW FEATURE: API Endpoint to fetch lists <<<
export const getGameList = (type: 'spectator' | 'replay'): Promise<GameMeta[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(type === 'spectator' ? mockActiveGames : mockReplays);
    }, 300); // Simulate network delay
  });
};

// Initial State
let currentState: GameState = {
  day: 1,
  phase: Phase.DAY_ANNOUNCE,
  players: generatePlayers(),
  logs: [],
  timeLeft: 30,
  winner: null,
  selfId: 1,
  sheriffId: null,
};

let intervalId: any = null;

// Mock Event Emitter pattern
type Listener = (state: GameState) => void;
const listeners: Set<Listener> = new Set();

export const subscribeToGame = (callback: Listener) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const broadcast = () => {
  listeners.forEach(l => l({ ...currentState }));
};

const addLog = (content: string, type: LogEntry['type'], speakerId?: number) => {
  const newLog: LogEntry = {
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
// >>> UPDATE: Added gameId parameter to simulate joining a specific room <<<
export const startGameLoop = (gameId?: string) => {
  if (intervalId) clearInterval(intervalId); // Ensure only one loop runs
  
  // In a real app, gameId would fetch specific state. 
  // Here we just restart the mock with new random names
  if (gameId) {
     resetGame(false); // Reset but don't clear interval yet as we are about to start
  }

  addLog(`Connected to Game Server...`, "system");
  addLog(gameId ? `Joined Room: ${gameId}` : "Game Initialized.", "system");
  
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
            } else {
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

export const resetGame = (isHuman: boolean = false) => {
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

export const sendHumanAction = (decision: AgentDecision) => {
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