import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { traduzirClima } from "@/utils/traduzirClima";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  date: number;
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "dd-MM-yyyy");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const NextDays = Object.values(dailyForecasts).slice(0, 6);

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão para os próximos dias</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="grid gap-4">
        {NextDays.map((day)=>{
            return <div key={day.date} className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4">
                <div>
                    <p className="font-medium">{format(new Date(day.date * 1000), "EEE, d 'de' MMMM", { locale: ptBR }).replace(/^./, (char) => char.toUpperCase())}</p>
                    <p className="text-sm text-muted-foreground capitalize">{traduzirClima(day.weather.description)}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                    <span className="flex items-center text-blue-500">
                        <ArrowDown className="mr-1 h-4 w-4"/>
                        {formatTemp(day.temp_min)}
                    </span>
                    <span className="flex items-center text-red-500">
                        <ArrowUp className="mr-1 h-4 w-4"/>
                        {formatTemp(day.temp_max)}
                    </span>
                </div>

                <div className="flex justify-end gap-4">
                    <span className="flex items-center gap-1">
                        <Droplets className="text-blue-500 h-4 w-4"/>
                        <span className="text-sm">{day.humidity}%</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Wind className="text-blue-500 h-4 w-4"/>
                        <span className="text-sm">{day.wind}m/s</span>
                    </span>
                </div>

            </div>
        })}
       </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
