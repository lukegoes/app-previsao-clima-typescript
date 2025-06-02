import CurrentWeather from "@/components/CurrentWeather";
import FavoriteButton from "@/components/favorite-button";
import FavoriteCities from "@/components/FavoriteCities";
import HourlyTemperature from "@/components/Hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import UvIndex from "@/components/UvIndex";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useForecastQuery, useUviQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"

const CityPage = () => {

  const [searchParams] = useSearchParams()
  const params = useParams();
  const lat = parseFloat (searchParams.get("lat") || "0");
  const lon = parseFloat (searchParams.get("lon") || "0");

  const coordinates = {lat, lon}

    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    const uviQuery = useUviQuery(coordinates);

    if (weatherQuery.error || forecastQuery.error || uviQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
        </AlertDescription>
      </Alert>
    );
  }

   if (!weatherQuery.data || !forecastQuery.data || !uviQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div><div className="space-y-4">
     <FavoriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName}, {weatherQuery.data.sys.country}</h1>
        <div>
          <FavoriteButton data={{...weatherQuery.data, name: params.cityName}} />
        </div>
        
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <div className="flex flex-col gap-4">
            <WeatherDetails data={weatherQuery.data} />
            {uviQuery.data && <UvIndex data={uviQuery.data} />}
          </div>

          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div></div>
  )
}
export default CityPage