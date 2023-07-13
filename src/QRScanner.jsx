import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import Confirmation from './Confirmation';

const QRScanner = () => {
    const [delay, setDelay] = useState(100);
    const [result, setResult] = useState(null);

    const handleScan = (data) => {
        if (data == null) return;
        console.log(data);
        setResult(data);
    };

    const handleError = (err) => {
        console.error(err);
    };

    const previewStyle = {
        height: 240,
        width: 320,
    };

    return (
        <div>
            {!result && (
                <QrReader
                delay={delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                />
            )}
            {result && (
                <Confirmation
                uid={result.text.split('-')[0]}
                tid={result.text.split('-')[1]}
                />
            )}
        </div>
    );
};

export default QRScanner;
