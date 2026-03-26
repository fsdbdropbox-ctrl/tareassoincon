import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { logingAndGetToken } from '../api/authService';
import { getInitialPhysicalStock } from '../api/stockService';


export const useStompoStock = (topic: string) => {

    const [stockMap, setStockMap] = useState<Record<number, number>>({});


    useEffect(() => {
        const fetStock = async () => {
            try {
                const initialData = await getInitialPhysicalStock(1);
                const newMap: Record<number, number> = {};

                initialData.forEach((item: { materialId: number, units: number }) => {
                    if (item.materialId !== undefined) {
                        newMap[item.materialId] = item.units || 0;
                    }
                });
                setStockMap(newMap);
                console.log("Stock inicial Cargado:" + newMap);

            } catch (error) {
                console.error("Error al cargar el stock inicial: " + error);
            }
        };
        fetStock();
    }, [])

    useEffect(() => {

        if (!topic) return;

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
                        setStockMap((prevStock) => {
                            const newStock = { ...prevStock };
                            if (Array.isArray(data)) {
                                data.forEach((item) => {
                                    newStock[item.materialId] = item.stock;
                                });
                            }
                            else if (data.materialId) {
                                newStock[data.materialId] = data.stock;
                            }
                            return newStock;
                        });
                    } catch (error) {
                        console.error("Error procesando un mensaje: " + error)
                    }
                })
            },
            onStompError: (frame) => {
                console.error("Error en STOMP: " + frame.headers['message']);
            },
        });
        stompClient.activate();
        return () => {
            stompClient.deactivate();
        };

    }, [topic])
    return stockMap;
}