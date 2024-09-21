import { symlink } from 'fs';
import React, { useState, useEffect } from 'react';

export function BaseKnock() {
    // 循环定时器Id
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    // 是否开启运行按钮
    const [isRunning, setIsRunning] = useState(false);
    // bpm设定
    const [bpm, setBpm] = useState<number | null>(60);
    // 拍数设定
    const [beat, setBeat] = useState<number | null>(0);

    const [syncopation, setSyncopation] = useState<string | null>('');


    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    // bpm转换为ms
    const bpmTranferMs = (bpm: number) => {
        return (1000 * 60) / bpm;
    };

    // 当前拍计数器
    let currentBeat:number = 0;

    // 发声
    // beatNum: 0: 强拍, 其他: 弱拍
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

    const tick = (ms:number) => {
        beep(currentBeat);
        
        // 切分
        if(syncopation === '1/4') {
            setTimeout(() => {beep(currentBeat)}, ms*1/4);
        }
        if(syncopation === '3/4') {
            setTimeout(() => {beep(currentBeat)}, ms*3/4);
        }

        currentBeat = (currentBeat + 1) % beat;
        console.log('tick');
    };

    const tickOnce = (ms:number, currentBeat:number) => {
        beep(currentBeat);
        currentBeat = (currentBeat + 1) % beat;
        console.log('tick');
    }

    useEffect(() => {
        if (isRunning) {
            if (intervalId === null) {
                currentBeat = 0;
                const ms = bpmTranferMs(bpm ?? 60);
                const id = setInterval(() => tick(ms), ms);
                setIntervalId(id);
            }
        } else if (intervalId !== null) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [isRunning, bpm]);

    // 处理切分拍逻辑
    const handleSyncopationChange = (e: { target: { value: React.SetStateAction<string | null>; }; }) => {
        setSyncopation(e.target.value);
    }

    
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
            切分拍:
            <select value={syncopation ?? ''} onChange={handleSyncopationChange}>
                <option value="none">无</option>
                <option value="1/4">前1/4</option>
                <option value="3/4">后1/4</option>
            </select>


            <button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
    );
}