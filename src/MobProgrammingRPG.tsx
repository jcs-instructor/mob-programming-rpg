import React, { useState } from "react";
import PlayerDisplay from "./PlayerDisplay";
import { Game } from "./model/Game";
import TimerDisplay from "./TimerDisplay";
import { RealClock } from "./RealClock";

const MobProgrammingRPG = ({startingPlayers = [], rotateAfter = 60 * 4, clock = new RealClock()}) => {
    const [game, setGame] = useState(new Game(startingPlayers));
    const [uiState, setUiState] = useState({showSettings: false, showWhoIsNext: false});

    function showSettings() {
        setUiState({...uiState, showSettings: !uiState.showSettings});
    }

    function changePlayers(event): void {
        event.preventDefault();
        const players = new FormData(event.target).get("change-players") as string;
        game.setPlayers(players);
        setGame(Object.create(game))
    }

    function rotate() {
        game.rotate();
        setGame(Object.create(game))
    }

    function explainWhoIsNext() {
        rotate();
        setUiState({...uiState, showWhoIsNext: true});
    }

    function continuePlaying() {
        setUiState({...uiState, showWhoIsNext: false});
    }

    return (
        <div className="rpgui-container framed full">
            <h1>Mob Programming RPG</h1>
            <ul aria-label="Player List" className="rpgui-container-framed">
                {game.players().map((player) => <PlayerDisplay playerName={player}
                                                               role={game.roleOf(player)}
                                                               key={player}/>)}
            </ul>
            <TimerDisplay rotateAfter={rotateAfter} clock={clock} onFinish={explainWhoIsNext} continuePlaying={continuePlaying}/>
            <div className="rpgui-container framed-grey buttons">
                <button className="rpgui-button" onClick={() => showSettings()}>Settings</button>
                <button className="rpgui-button" onClick={() => rotate()}>Rotate</button>
            </div>
            {uiState.showWhoIsNext &&
              <div className="time-over-overlay rpgui-container framed-golden-2">
                <h2>Time is over</h2>

                <br/>
                <p>Next up</p>

                <h3 title="Driver">Driver: {game.driver()}</h3>
                <h3 title="Navigator">Navigator: {game.navigator()}</h3>
                <h3 title="Next">Next: {game.next()}</h3>

                <br/>
                <br/>
                <br/>
                <br/>
                <button className="rpgui-button golden" onClick={() => continuePlaying()}>
                  <p>Close</p>
                </button>
              </div>
            }

            {uiState.showSettings &&
              <div className="rpgui-container framed-golden">
                <form onSubmit={changePlayers}>
                  <label>Change Players
                    <textarea id="change-players" name="change-players"
                              defaultValue={game.players().join(", ")}></textarea>
                  </label>
                  <button type="submit">Save</button>
                </form>
              </div>
            }
        </div>
    );
};

export default MobProgrammingRPG;
