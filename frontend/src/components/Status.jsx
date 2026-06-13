import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';

export default function Status() {
    const [status, setStatus] = useState('Checking...');
    const [ok, setOk] = useState(false);

    useEffect(() => {
        async function check() {
            try {
                const res = await api.getStatus();
                setStatus(`Connected (${res.hostname})`);
                setOk(true);
            } catch {
                setStatus('Backend not reachable');
                setOk(false);
            }
        }

        check();
    }, []);

    return (
        <div className={ok ? 'status ok' : 'status error'}>
            {status}
        </div>
    );
}
