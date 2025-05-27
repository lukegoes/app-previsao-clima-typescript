import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState{
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeolocation(){
    const [locationData, setLocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true,
    });

    const getLocation=()=>{
        setLocationData((prev)=>({...prev, isLoading: true, error: null}));

        if (!navigator.geolocation) {
            setLocationData({
                coordinates: null,
                error: "Seu navegador não suporta geolocalização.",
                isLoading: false,
            })
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false
            })
        }, (error)=>{
            let errorMessage: string;

            switch(error.code){
                case error.PERMISSION_DENIED:
                    errorMessage = "O usuário rejeitou a solicitação de geolocalização.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Informações de geolocalização indisponíveis.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "O tempo de solicitação de geolocalização expirou.";
                    break;
                default:
                    errorMessage = "Ocorreu um erro desconhecido ao obter a geolocalização.";
            }

            setLocationData({
                coordinates: null,
                error: errorMessage,
                isLoading: false
            });
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })
    }

    useEffect(()=>{
        getLocation();
    },[])

    return {...locationData, getLocation}
}