import React, { useState, useEffect } from 'react';

export function BaseKnock() {
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [bpm, setBpm] = useState<number | null>(60);
    const [beat, setBeat] = useState<number | null>(0);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const bpmTranferMs = (bpm: number) => {
        return (1000 * 60) / bpm;
    };

    // 当前拍计数器
    var currentBeat:number = 0;


    const beep = (beatNum: number) => {
        const audioContext = new (window.AudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (beatNum === 0) {
            oscillator.frequency.value = 880;
        } else {
            oscillator.frequency.value = 220;
        }

        oscillator.type = 'sine';
        gainNode.gain.value = 0.5;

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 100);
    };

    const tick = () => {
        beep(currentBeat);
        currentBeat = (currentBeat + 1) % beat;
        console.log('tick');
    };

    useEffect(() => {
        if (isRunning) {
            if (intervalId === null) {
                currentBeat = 0;
                const ms = bpmTranferMs(bpm ?? 60);
                const id = setInterval(tick, ms);
                setIntervalId(id);
            }
        } else if (intervalId !== null) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [isRunning, bpm]);

    return (
        <div>
            <h1>Base Knock</h1>
            bpm:<input
                type="number"
                value={bpm ?? ''}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
            <div></div>
            beat:<input
                type="number"
                value={beat ?? ''}
                onChange={(e) => setBeat(Number(e.target.value))}
            />
            <button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
    );
}