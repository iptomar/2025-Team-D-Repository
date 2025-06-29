import { useEffect, useState, useRef } from 'react';
import socket from '../../utils/socket'
import '../../styles/ConsoleViewer.css';

import { TbTerminal2 } from "react-icons/tb";

const ConsoleViewer = () => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handler = (log) => {
      setLogs((prevLogs) => [...prevLogs.slice(-999), log]);
    };

    const clearHandler = () => {
      setLogs([]); // clear logs on 'clear-logs' event
    };

    socket.on('console-log', handler);
    socket.on('clear-logs', clearHandler);

    socket.emit("refresh-logs");

    return () => {
      socket.off('console-log', handler);
      socket.off('clear-logs', clearHandler);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);


  const getColorForLevel = (level) => {
    switch (level) {
      case 'info': return '#75CD63';
      case 'error': return '#FF0000';
      case 'warn': return '#FFA500';
      case 'debug': return '#00FFFF';
      case 'setup': return '#FFDE21';
      default: return '#E0E0E0';
    }
  };

  return (
    <div className="console-container">
      <div className="console-header">
        <TbTerminal2 size={35} color='#bbb' />
        Server Console - Live Feed
      </div>
      <div className="console-logs">
        {logs.map(([message, level], idx) => (
          <div key={idx} className="console-line" style={{ color: getColorForLevel(level) }}>{message}</div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ConsoleViewer;
