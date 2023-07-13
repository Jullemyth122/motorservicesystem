import React, { useEffect, useState } from 'react';

export default function Verify() {
    const [date, setDate] = useState();
    const SECOND_MS = 1000;

    useEffect(() => {}, [setDate]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newDate = Date();
            setDate(newDate);
        }, SECOND_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <h1 className="title"> QR CODE </h1>
            <p>{date}</p>
            <div className="module">
                <QRScanner />
                <div className="result"></div>
            </div>
        </div>
  );
}
