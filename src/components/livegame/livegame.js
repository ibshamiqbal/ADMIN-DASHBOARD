import React, { useState, useEffect } from 'react';
import './livegame.css';

const LiveGame = () => {
    const [games, setGames] = useState([]);
    const [teams, setTeams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newGame, setNewGame] = useState({
        team1: '',
        team2: '',
        score: '',
        channel: '',
        date: '',
        time: '',
        live: false, // Default value for live status
        highlights: '', // New field for highlights
        restriction: '', // New field for restriction
    });

    // Fetch live games from the API
    const handleGetGames = async () => {
        try {
            const response = await fetch('https://basketball-backend-dun.vercel.app/liveGame/get-LiveGames', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Games fetched successfully:', responseData);
                setGames(responseData);
            } else {
                console.error('Error fetching games:', responseData.message);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    // Fetch teams for the dropdown
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('https://basketball-backend-dun.vercel.app/liveTeam/get-team', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();
                if (response.ok) {
                    setTeams(data);
                } else {
                    console.error('Error fetching teams:', data.message);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    // Fetch games on component load
    useEffect(() => {
        handleGetGames();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting new game:', newGame); // Debug: Check the form data
        try {
            const response = await fetch('https://basketball-backend-dun.vercel.app/liveGame/create-LiveGames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGame),
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                console.log('Game created successfully:', responseData);
                setGames((prevGames) => [...prevGames, responseData]);
            } else {
                console.error('Error creating game:', responseData.message);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    
        setShowForm(false); // Hide the form
        setNewGame({
            team1: '',
            team2: '',
            score: '',
            channel: '',
            date: '',
            time: '',
            highlights: '',
            restriction: '',
            live: false,
        });
    };
   
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewGame((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting game with ID: ${id}`);

            const response = await fetch(`https://basketball-backend-dun.vercel.app/liveGame/liveGame/delete-LiveGame/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json();
            if (response.ok) {
                setGames((prevGames) => prevGames.filter((game) => game._id !== id));
            } else {
                console.error('Failed to delete game:', responseData.message);
            }
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleFlip = async (id) => {
        try {
            const response = await fetch(
                `https://basketball-backend-dun.vercel.app/liveGame/liveGame/flip-LiveGame/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const responseData = await response.json();
            if (response.ok) {
                setGames((prevGames) =>
                    prevGames.map((game) =>
                        game._id === id ? responseData.flipGame : game
                    )
                );
            } else {
                console.error("Failed to toggle live state:", responseData.message);
            }
        } catch (error) {
            console.error("Error toggling live state:", error);
        }
    };    
    

    return (
        <div className="live-game-container">
            <h2>Live Game</h2>
            <button className="btn-add-game" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Add Game'}
            </button>
            {showForm && (
                <form className="game-form" onSubmit={handleSubmit}>
                    <label>
                        Team 1:
                        <select name="team1" value={newGame.team1} onChange={handleInputChange} required>
                            <option value="" disabled>Select a team</option>
                            {teams.map((team) => (
                                <option key={team._id} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Team 2:
                        <select name="team2" value={newGame.team2} onChange={handleInputChange} required>
                            <option value="" disabled>Select a team</option>
                            {teams.map((team) => (
                                <option key={team._id} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Score: <input type="text" name="score" value={newGame.score} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Channel: <input type="text" name="channel" value={newGame.channel} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Date: <input type="date" name="date" value={newGame.date} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Time: <input type="time" name="time" value={newGame.time} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Highlights: <input type="text" name="highlights" value={newGame.highlights} onChange={handleInputChange} />
                    </label>
                    <label>
                        Restriction: <input type="text" name="restriction" value={newGame.restriction} onChange={handleInputChange} />
                    </label>
                    <label>
                        Live:
                        <input
                            type="checkbox"
                            name="live"
                            checked={newGame.live}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            )}
            <table className="live-game-table">
                <thead>
                    <tr>
                        <th>Team 1</th>
                        <th>Team 2</th>
                        <th>Scores</th>
                        <th>Channel</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Live</th>
                        <th>Highlights</th>
                        <th>Restriction</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.length ? (
                        games.map((game) => (
                            <tr key={game._id}>
                                <td>{game.team1}</td>
                                <td>{game.team2}</td>
                                <td>{game.score}</td>
                                <td>{game.channel}</td>
                                <td>{new Date(game.date).toLocaleDateString()}</td>
                                <td>{game.time}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={game.live || false}
                                        onChange={() => handleFlip(game._id)}
                                    />
                                </td>
                                <td>{game.highlights}</td>
                                <td>{game.restriction}</td>
                                <td>
                                    <button className="btn-delete" onClick={() => handleDelete(game._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No live games available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LiveGame;
