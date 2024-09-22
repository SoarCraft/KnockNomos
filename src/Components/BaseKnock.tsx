import React, { useState, useEffect } from 'react';

export function BaseKnock() {
    // 循环定时器Id
    const [intervalId, setIntervalId] = useState<number | null>(null);
    // 是否开启运行按钮
    const [isRunning, setIsRunning] = useState<boolean>(false);
    // bpm设定
    const [bpm, setBpm] = useState<number | null>(60);
    // 拍数设定
    const [beat, setBeat] = useState<number | null>(0);
    // 切分拍标记设定
    const [syncopation, setSyncopation] = useState<string | null>('');

    // 当前拍计数器
    let currentBeat:number = 0;

    const audioContextRef = React.useRef(new (window.AudioContext)());
    if(audioContextRef.current === null){
        audioContextRef.current = new (window.AudioContext)();
    }

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    /**
     * bpm转换为ms
     * @param bpm 
     * @returns 转换后对应的ms
     * 
     */
    const bpmTranferMs = (bpm: number) => {
        return (1000 * 60) / bpm;
    };

    /**
     * 发出一个声音
     * beatNum: 0: 强拍, 其他: 弱拍
     * @param beatNum 拍数
     * @author HarryG
     */
    const beep = (beatNum: number) => {
        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (beatNum === 0) {
            oscillator.frequency.value = 880;
        } else if(beatNum === 99) {
            // 切分拍专用
            oscillator.frequency.value = 220;
        } else {
            oscillator.frequency.value = 440;
        }

        oscillator.type = 'sine';
        gainNode.gain.value = 0.5;

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 50);
    };

    /**
     * 切分拍处理
     * @param ms 拍数延时
     * @author HarryG
     */
    const syncopationBeep = (ms:number) => {
        if(syncopation === '1/4') {
            setTimeout(() => {beep(99)}, ms*1/4);
        }
        if(syncopation === '3/4') {
            setTimeout(() => {beep(99)}, ms*3/4);
        }
        if(syncopation === '16分') {
            setTimeout(() => {beep(99)}, ms*1/4);
            setTimeout(() => {beep(99)}, ms*2/4);
            setTimeout(() => {beep(99)}, ms*3/4);
        }
    }

    /**
     * 定时器处理函数
     * @param ms 拍数延时
     */
    const tick = (ms:number) => {
        // 正拍处理
        beep(currentBeat);
        // 切分后使用弱拍处理，只有一个强拍用于指示起始拍
        currentBeat = (currentBeat + 1) % beat;
        // 切分拍处理
        syncopationBeep(ms);
    };

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
                <option value="16分">16分</option>
            </select>


            <button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
    );
}