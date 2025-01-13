import React, { useState, useEffect } from "react";
import "./Main.css";
import nbalive from "../../assets/nbalive.jpg";
import Chart from "../charts/Chart";

const Main = () => {
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [lastUpdateGames, setLastUpdateGames] = useState(null); // Last update time for games
  const [lastUpdateH2h, setLastUpdateH2h] = useState(null); // Last update time for h2h
  const [lastUpdateStandings, setLastUpdateStandings] = useState(null); // Last update time for standings
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users
        const usersResponse = await fetch("https://basketball-backend-dun.vercel.app/user/users");
        if (!usersResponse.ok) {
          throw new Error("Error fetching users");
        }
        const usersData = await usersResponse.json();
        setTotalUsers(usersData['users'].length);

        // Fetch last updated times for games, h2h, standings
        const gamesUpdateResponse = await fetch("https://basketball-backend-dun.vercel.app/games/last-updated");
        const gamesUpdateData = await gamesUpdateResponse.json();
        setLastUpdateGames(gamesUpdateData.lastUpdated);

        const h2hUpdateResponse = await fetch("https://basketball-backend-dun.vercel.app/h2h/h2h/last-updated");
        const h2hUpdateData = await h2hUpdateResponse.json();
        setLastUpdateH2h(h2hUpdateData.lastUpdated);

        const standingsUpdateResponse = await fetch("https://basketball-backend-dun.vercel.app/standings/standings/last-updated");
        const standingsUpdateData = await standingsUpdateResponse.json();
        setLastUpdateStandings(standingsUpdateData.lastUpdated);

        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching the API data:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <div className="main__container">
        <div className="main__title">
          <img src={nbalive} alt="nbalive" className="img" />
          <div className="main__greeting">
            <h1>NBA LIVE SCORE</h1>
            <p>Welcome to our admin panel</p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="main__cards">
          <div className="card">
            <i className="fas fa-users fa-2x text-lightblue"></i>
            <div className="card_inner">
              <p className="text-primary-p">Total Users</p>
              <span className="font-bold text-title">
                {loading ? "Loading..." : totalUsers}
              </span>
            </div>
          </div>

          <div className="card">
            <i className="fas fa-basketball-ball fa-2x text-red"></i>
            <div className="card_inner">
              <p className="text-primary-p">Last Update - Games</p>
              <span className="font-bold text-title">
                {loading ? "Loading..." : lastUpdateGames ? new Date(lastUpdateGames).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>

          <div className="card">
            <i className="fas fa-video-camera fa-2x text-yellow"></i>
            <div className="card_inner">
              <p className="text-primary-p">Last Update - Head to Head</p>
              <span className="font-bold text-title">
                {loading ? "Loading..." : lastUpdateH2h ? new Date(lastUpdateH2h).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>

          <div className="card">
            <i className="fas fa-flag fa-2x text-green"></i>
            <div className="card_inner">
              <p className="text-primary-p">Last Update - Standings</p>
              <span className="font-bold text-title">
                {loading ? "Loading..." : lastUpdateStandings ? new Date(lastUpdateStandings).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <div className="charts__left">
            <div className="charts_left_title">
              <div>
                <h1>Daily Reports</h1>
                <p>Pakistan, Lahore, Australia</p>
              </div>
              <i className="fas fa-usd"></i>
            </div>
            <Chart />
          </div>

          <div className="charts__right">
            <div className="charts__right__title">
              <h1>Stats Reports</h1>
              <p>Islamabad, Pakistan</p>
            </div>
            <i className="fas fa-use"></i>

            {/* Stats Section */}
            <div className="charts__right__cards">
              <div className="card1">
                <h1>Income</h1>
                <p>$7,000,000</p>
              </div>
              <div className="card2">
                <h1>Sales</h1>
                <p>$99,999,999</p>
              </div>
              <div className="card3">
                <h1>Users</h1>
                <p>{loading ? "Loading..." : totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
