import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { logingAndGetToken } from '../api/authService';
import { getInitialPhysicalStock } from '../api/stockService';


export const useStompoStock = (topic: string) => {

    const [stockMap, setStockMap] = useState<Record<number, number>>({});


    const fetchStock = useCallback(async () => {
        try {
            const initialData = await getInitialPhysicalStock(1);
            const newMap: Record<number, number> = {};

            initialData.forEach((item: { materialId: number, units: number }) => {
                if (item.materialId !== undefined) {
                    newMap[item.materialId] = item.units || 0;
                }
            });
            setStockMap(newMap);
            console.log("Cargado Stock :" + newMap);

        } catch (error) {
            console.error("Error al cargar el stock inicial: " + error);
        }
    }, []);

    useEffect(() => {

        if (!topic) return;
        fetchStock();
        const stompClient = new Client({
            brokerURL: 'wss://desarrollo.emisuite.es:15673/ws',
            connectHeaders: {
                login: 'snc',
                passcode: 'snc123!',
                host: '/'
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Conectado al Socket de Stock");

                stompClient.subscribe(topic, (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        const payload = data.payload;
                        if (!payload) return;

                        if (payload.operation === "OUTPUT") {
                            console.log("Pidiendo un nuevo stock")
                            fetchStock();
                        }
                    } catch (error) {
                        console.error("Error procesando un mensaje: " + error)
                    }
                });
            },
            onStompError: (frame) => {
                console.error("Error en STOMP: " + frame.headers['message']);
            },
        });
        stompClient.activate();
        return () => {
            stompClient.deactivate();
        };

    }, [topic, fetchStock]);
    return stockMap;
};