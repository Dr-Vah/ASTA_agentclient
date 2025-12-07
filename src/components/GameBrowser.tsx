import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Eye, Trophy, ArrowLeft, Users } from 'lucide-react';
import { GameMeta } from '../types';
import { getGameList } from '../services/mockGameEngine';

interface GameBrowserProps {
    mode: 'spectator' | 'replay';
}

const GameBrowser: React.FC<GameBrowserProps> = ({ mode }) => {
    const navigate = useNavigate();
    const [games, setGames] = useState<GameMeta[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getGameList(mode).then(data => {
            setGames(data);
            setLoading(false);
        });
    }, [mode]);

    const filteredGames = games.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.players.some(p => p.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex-1 p-6 flex flex-col max-w-7xl mx-auto w-full h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-cyber-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            {mode === 'spectator' ? <Eye className="text-cyber-accent" /> : <Trophy className="text-cyber-warning" />}
                            {mode === 'spectator' ? 'LIVE GAMES' : 'MATCH ARCHIVES'}
                        </h1>
                        <p className="text-gray-400 text-sm font-mono mt-1">
                            {mode === 'spectator' ? 'Select a active lobby to watch.' : 'Review past strategies and outcomes.'}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-64 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search agents or match ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-cyber-900 border border-cyber-700 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-cyber-accent font-mono"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-pulse text-cyber-accent font-mono">LOADING DATA_STREAMS...</div>
                    </div>
                ) : filteredGames.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20 font-mono">NO MATCHES FOUND.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGames.map((game) => (
                            <div
                                key={game.id}
                                onClick={() => navigate(`/arena?mode=${mode}&id=${game.id}`)}
                                className="glass-panel p-5 rounded-xl border border-white/5 hover:border-cyber-accent/50 hover:bg-cyber-800/30 cursor-pointer transition-all group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${game.status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-700 text-gray-300'}`}>
                                        {game.status === 'LIVE' ? '● LIVE' : 'FINISHED'}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">Day {game.day}</span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-100 mb-1 group-hover:text-cyber-accent transition-colors">
                                    {game.title}
                                </h3>
                                <div className="text-xs text-gray-500 font-mono mb-4">{game.id}</div>

                                {/* Mini Player List */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Users className="w-3 h-3" />
                                        <span>Top Agents:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {game.players.slice(0, 4).map((p, i) => (
                                            <span key={i} className="text-[10px] bg-cyber-900 border border-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                                                {p}
                                            </span>
                                        ))}
                                        {game.players.length > 4 && <span className="text-[10px] text-gray-500 px-1">+5</span>}
                                    </div>
                                </div>

                                {game.winner && (
                                    <div className={`text-xs font-bold text-center py-1 rounded border ${game.winner === 'WEREWOLVES' ? 'border-red-900 bg-red-900/20 text-red-400' : 'border-green-900 bg-green-900/20 text-green-400'}`}>
                                        WINNER: {game.winner}
                                    </div>
                                )}

                                {!game.winner && (
                                    <div className="flex items-center text-cyber-accent text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        WATCH STREAM <Play className="w-3 h-3 ml-1 fill-current" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBrowser;