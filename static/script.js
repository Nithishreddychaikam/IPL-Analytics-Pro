// ======================================
// IPL Analytics Pro
// script.js
// ======================================

// ---------- API ----------
const API = {
    metadata: "/metadata",
    score: "/predict-score",
    win: "/predict-win"
};

// ---------- Dropdown Elements ----------
const battingTeamScore = document.getElementById("battingTeamScore");
const bowlingTeamScore = document.getElementById("bowlingTeamScore");
const venueScore = document.getElementById("venueScore");

const battingTeamWin = document.getElementById("battingTeamWin");
const bowlingTeamWin = document.getElementById("bowlingTeamWin");
const venueWin = document.getElementById("venueWin");

// ---------- Forms ----------
const scoreForm = document.getElementById("scoreForm");
const winForm = document.getElementById("winForm");

// ---------- Results ----------
const scoreResult = document.getElementById("scoreResult");
const winResult = document.getElementById("winResult");

// ======================================
// Load Metadata
// ======================================

async function loadMetadata() {

    try {

        const response = await fetch(API.metadata);

        const data = await response.json();

        populateTeams(data.teams);

        populateVenues(data.venues);

    } catch (error) {

        console.error("Metadata Error:", error);

    }

}

// ======================================
// Populate Teams
// ======================================

function populateTeams(teams) {

    const teamDropdowns = [
        battingTeamScore,
        bowlingTeamScore,
        battingTeamWin,
        bowlingTeamWin
    ];

    teamDropdowns.forEach(dropdown => {

        dropdown.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.value = "";

        if (
            dropdown.id === "battingTeamScore" ||
            dropdown.id === "battingTeamWin"
        ) {
            defaultOption.text = "Select Batting Team";
        }
        else {
            defaultOption.text = "Select Bowling Team";
        }

        dropdown.appendChild(defaultOption);

        teams.forEach(team => {

            const option = document.createElement("option");

            option.value = team;

            option.text = team;

            dropdown.appendChild(option);

        });

    });

}

// ======================================
// Populate Venues
// ======================================

function populateVenues(venues) {

    const venueDropdowns = [

        venueScore,

        venueWin

    ];

    venueDropdowns.forEach(dropdown => {

        dropdown.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.text = "Select Venue";

        defaultOption.value = "";

        dropdown.appendChild(defaultOption);

        venues.forEach(venue => {

            const option = document.createElement("option");

            option.value = venue;

            option.text = venue;

            dropdown.appendChild(option);

        });

    });

}

// ======================================
// Prevent Same Teams
// ======================================

function updateBowlingDropdown(battingDropdown, bowlingDropdown) {

    const selectedTeam = battingDropdown.value;

    Array.from(bowlingDropdown.options).forEach(option => {

        option.disabled = option.value === selectedTeam && option.value !== "";

    });

}

battingTeamScore.addEventListener("change", () => {

    updateBowlingDropdown(battingTeamScore, bowlingTeamScore);

});

battingTeamWin.addEventListener("change", () => {

    updateBowlingDropdown(battingTeamWin, bowlingTeamWin);

});

// ======================================
// Initialize
// ======================================

loadMetadata();
// ======================================
// Projected Score Prediction
// ======================================

scoreForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    scoreResult.innerHTML = `
<div class="loading-card">

    <div class="loader"></div>

    <div class="loading-text">
        Analysing Match...
    </div>

    <div class="loading-sub">
        Predicting First Innings Score
    </div>

</div>
`;

    const payload = {

        batting_team: battingTeamScore.value,
        bowling_team: bowlingTeamScore.value,
        venue: venueScore.value,
        current_score: document.getElementById("currentScore").value,
        wickets_lost: document.getElementById("wicketsLost").value,
        overs: document.getElementById("oversCompleted").value

    };

    try {

        const response = await fetch(API.score, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (data.success) {

            scoreResult.innerHTML = `
    <div class="result-card">

        <div class="result-title">
            🏏 PROJECTED SCORE
        </div>

        <div class="result-score">
            ${data.projected_score}
        </div>

        <div class="result-subtitle">
            Expected First Innings Total
        </div>

    </div>
`;

        } else {

            scoreResult.innerHTML = "Prediction Failed";

        }

    } catch (error) {

        console.error(error);

        scoreResult.innerHTML = "Server Error";

    }


});
// ======================================
// Win Probability Prediction
// ======================================


winForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    winResult.innerHTML = `
<div class="loading-card">

    <div class="loader"></div>

    <div class="loading-text">
        Analysing Match...
    </div>

    <div class="loading-sub">
        Calculating Win Probability
    </div>

</div>
`;

    const payload = {

        batting_team: battingTeamWin.value,

        bowling_team: bowlingTeamWin.value,

        venue: venueWin.value,

        target: document.getElementById("target").value,

        current_score: document.getElementById("currentScoreWin").value,

        overs: document.getElementById("oversWin").value,

        wickets_left: document.getElementById("wicketsLeft").value

    };
    // ===============================
// Win Prediction Validation
// ===============================

// Empty fields
if (
    !payload.batting_team ||
    !payload.bowling_team ||
    !payload.venue ||
    payload.target === "" ||
    payload.current_score === "" ||
    payload.overs === "" ||
    payload.wickets_left === ""
) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Please fill all fields.</h3>";
    return;
}

// Same team
if (payload.batting_team === payload.bowling_team) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Batting and Bowling teams cannot be the same.</h3>";
    return;
}

// Overs
if (parseFloat(payload.overs) <= 0 || parseFloat(payload.overs) > 20) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Overs must be between 0.1 and 20.</h3>";
    return;
}

// Wickets
if (parseInt(payload.wickets_left) < 0 || parseInt(payload.wickets_left) > 10) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Wickets Left must be between 0 and 10.</h3>";
    return;
}

// Target
if (parseInt(payload.target) <= 0) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Target must be greater than 0.</h3>";
    return;
}

// Current Score
if (parseInt(payload.current_score) < 0) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Current Score cannot be negative.</h3>";
    return;
}

// Score cannot exceed target
if (parseInt(payload.current_score) >= parseInt(payload.target)) {
    winResult.innerHTML =
        "<h3 style='color:#ff4d4d;'>⚠ Current Score cannot be greater than or equal to Target.</h3>";
    return;
}

    try {

        const response = await fetch(API.win, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (data.success) {

    winResult.innerHTML = `
<div class="result-card">

    <div class="result-title">
        🏆 MATCH PREDICTION
    </div>

    <div class="winner-name">
        ${data.batting_win_probability > data.bowling_win_probability
            ? data.batting_team
            : data.bowling_team}
    </div>

    <div class="winner-probability">
        Winning Chance
        <br>
        ${Math.max(data.batting_win_probability, data.bowling_win_probability)}%
    </div>

</div>
`;

    document.getElementById("battingTeamName").innerText = data.batting_team;

    document.getElementById("bowlingTeamName").innerText = data.bowling_team;

    document.getElementById("battingPercent").innerText =
        data.batting_win_probability + "%";

    document.getElementById("bowlingPercent").innerText =
        data.bowling_win_probability + "%";

    const battingBar = document.getElementById("battingBar");
    const bowlingBar = document.getElementById("bowlingBar");

    // Reset bars
    battingBar.style.width = "0%";
    bowlingBar.style.width = "0%";

    // Animate after a short delay
    setTimeout(() => {

        battingBar.style.width = data.batting_win_probability + "%";
        bowlingBar.style.width = data.bowling_win_probability + "%";

    }, 200);

}

        else {

            winResult.innerHTML = "Prediction Failed";

        }

    }

    catch (error) {

        console.error(error);

        winResult.innerHTML = "Server Error";

    }

});