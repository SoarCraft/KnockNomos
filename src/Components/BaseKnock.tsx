import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { log } from 'console';
import React, { useState, useEffect } from 'react';

export function BaseKnock() {
    // 定义一个状态变量来存储定时器Id
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // 定义一个状态变量控制定时器开始和停止
    const [isRunning, setIsRunning] = useState(false);

    // BPM 速度值
    const [bpm, setBpm] = useState<number | null>(null);


    const tick = () => {
        // todo 输出滴答的声音
        console.log('tick');
    }

    // running触发开关
    const toggleTimer = () => {
        setIsRunning(!isRunning)
    }

    // bpm转换为ms
    const bpmTranferMs = (bpm:number) =>{
        return (1000 * 60)/ bpm;
    }

    useEffect(() => {
        if(isRunning) {
            // 如果定时器没有启动，启动定时器
            if(intervalId === null) {
                const ms = bpmTranferMs(bpm ?? 60); // Provide a default value if bpm is null
                const id = setInterval(tick, ms);
                log('intervalId', id);
                setIntervalId(id);
            }
        } else if(intervalId !== null) {
            // 进行定时器清空
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [isRunning])

    return (
        <div>
            <h1>Base Knock</h1>
            <input
                type="number"
                value={bpm ?? ''}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
            <button onClick={toggleTimer}>{isRunning ? 'Stop' : 'Start'}</button>
        </div>
    )
}