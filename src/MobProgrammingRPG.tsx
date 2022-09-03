import React, { useEffect, useState } from "react";
import PlayerDisplay from "./PlayerDisplay";
import { Game } from "./model/Game";
import TimerDisplay from "./TimerDisplay";
import { RealClock } from "./RealClock";

const useLocalStorageGame: (defaultGame) => [Game, React.Dispatch<React.SetStateAction<Game>>] = (defaultGame) => {
    function initialState() {
        const json = localStorage.getItem("game");
        if (json !== null) {
            return Game.fromJSON(json);
        } else {
            return defaultGame;
        }
    }

    const [game, setGame] = useState(initialState());

    useEffect(() => {
        localStorage.setItem("game", game.toJSON());
    }, [game]);

    return [game, setGame];
};


const MobProgrammingRPG = (
    {
        startingPlayers = [],
        rotateAfter = 60 * 4,
        clock = new RealClock()
    }
) => {
    const [game, setGame] = useLocalStorageGame(Game.withPlayers(startingPlayers));
    const [uiState, setUiState] = useState({showSettings: false, showWhoIsNext: false});

    function toggleSettings() {
        setUiState({...uiState, showSettings: !uiState.showSettings});
    }

    function changePlayers(event): void {
        const players = new FormData(event.target).get("change-players") as string;
        game.setPlayers(players);
        updateGameState();
        event.preventDefault();
    }

    function rotate() {
        game.rotate();
        updateGameState();
    }

    function updateGameState() {
        setGame(game.clone());
    }

    function timeOver() {
        rotate();
        explainWhoIsNext();
    }

    function explainWhoIsNext() {
        setUiState({...uiState, showWhoIsNext: true});
    }

    function continuePlaying() {
        setUiState({...uiState, showWhoIsNext: false});
    }

    return (
        <div className="rpgui-container framed full">
            <h1>
                Mob Programming RPG
                <img className="logo" alt="logo" src={process.env.PUBLIC_URL + "/favicon.png"}/>
            </h1>
            <ul aria-label="Player List" className="rpgui-container-framed">
                {game.players().map((player) =>
                    <PlayerDisplay
                        player={player}
                        role={game.roleOf(player.name())}
                        updateGameState={updateGameState}
                        key={player.name()}
                    />
                )}
            </ul>
            <div className="rpgui-container framed-grey buttons">
                <button className="rpgui-button" onClick={toggleSettings}><p>Settings</p></button>
                <button className="rpgui-button" onClick={rotate}><p>Rotate</p></button>
                <TimerDisplay
                    rotateAfter={rotateAfter}
                    clock={clock}
                    onFinish={timeOver}
                    continuePlaying={continuePlaying}
                />
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
                <button className="rpgui-button golden" onClick={continuePlaying}>
                  <p>Close</p>
                </button>
              </div>
            }

            {uiState.showSettings &&
              <div className="rpgui-container framed-golden settings">
                <form onSubmit={changePlayers}>
                  <label>Change Players
                    <textarea id="change-players" name="change-players"
                              defaultValue={game.players().map(it => it.name()).join(", ")}></textarea>
                  </label>
                  <button type="submit" className="rpgui-button"><p>Save</p></button>
                  <button className="rpgui-button" onClick={toggleSettings}><p>Close</p></button>
                </form>
              </div>
            }
        </div>
    );
};

export default MobProgrammingRPG;
