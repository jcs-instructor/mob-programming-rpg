import React, { useEffect, useState } from "react";
import { Countdown } from "./model/Countdown";
import { RealClock } from "./RealClock";
import { format } from "./model/Clock";

const TimerDisplay = (
    {
        rotateAfter = 60 * 1000 * 4,
        clock = new RealClock(),
        onFinish = () => {}
    }
) => {
    const [timeLeft, setTimeLeft] = useState(format(rotateAfter));
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const countdown = new Countdown(rotateAfter, rotate, clock);
        const interval = setInterval(() => {
            setTimeLeft(countdown.timeLeftPretty());
        }, 1000);

        function rotate() {
            setTimeLeft(countdown.timeLeftPretty());
            clearInterval(interval);
            onFinish();
        }

        if (started) {
            countdown.start();
        }
    })

    function start() {
        setStarted(true);
    }

    return (
        <div className="timer" title="timer">
            <span className="time-display">{timeLeft}</span>
            <button onClick={() => start()}>Start</button>
        </div>
    );
};

export default TimerDisplay;
