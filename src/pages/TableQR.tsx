import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { nanoid } from 'nanoid';

interface TableInfo {
  tableName: string;
  isOccupied: boolean;
  capacity: number;
  message: string;
}

const TableQR = () => {
  const { qrToken } = useParams();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const validateAndStartSession = async () => {
      if (!qrToken) return;
      setLoading(true);
      setError(null);

      try {
        // 1. QR doğrulama
        const res = await fetch(`/api/table/qr/${qrToken}`);
        const data = await res.json();
        if (!data.valid) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setTableInfo(data);

        // 2. Fingerprint ve customerIdentifier
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const deviceFingerprint = result.visitorId;
        const preferredLanguage = language;
        let customerIdentifier = localStorage.getItem('customerIdentifier');
        if (!customerIdentifier) {
          customerIdentifier = nanoid();
          localStorage.setItem('customerIdentifier', customerIdentifier);
        }

        // 3. Session başlat
        const sessionRes = await fetch('/api/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrToken,
            deviceFingerprint,
            preferredLanguage,
            customerIdentifier,
          }),
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          // Session token'ı localStorage'a kaydet
          localStorage.setItem('customerSessionToken', sessionData.sessionToken);
        } else if (sessionRes.status === 404) {
          setError('Oturum başlatma özelliği yakında eklenecek.');
        } else {
          const sessionData = await sessionRes.json();
          setError(sessionData.message || 'Oturum başlatılamadı.');
        }
      } catch (e) {
        setError('Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    validateAndStartSession();
  }, [qrToken, language]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tableInfo) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">{tableInfo.tableName}</h1>
      <p>Masa Durumu: {tableInfo.isOccupied ? "Dolu" : "Boş"}</p>
      <p>Kapasite: {tableInfo.capacity}</p>
      <p>{tableInfo.message}</p>
    </div>
  );
};

export default TableQR; 