import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Clock,
  Loader2,
  Search,
  SearchIcon,
  Star,
  XCircle,
} from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, state, country] = cityData.split("|");
   
    addToHistory.mutate({
      query,
      name,
      state,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  const favorites = useFavorite();

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Pesquisar cidade
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Digite o nome da cidade..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          )}

          {favorites.favorites.length > 0 && (
            <CommandGroup heading="Cidades Favoritas">
              {favorites.favorites.map((location) => (
                <CommandItem
                  key={location.id}
                  value={`${location.lat}|${location.lon}|${location.name}|${
                    location.state || ""
                  }|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <div className="flex flex-col">
                    <span className="font-medium">{location.name.trim()}</span>
                    <span className="text-muted-foreground text-sm">
                      {`${
                        location.state ? location.state.trim() + " - " : ""
                      }${location.country.trim()}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Pesquisas Recentes
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
                {history.map((location) => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${
                        location.name
                      }| ${location.state || ""} | ${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />

                      <div className="flex flex-col">
                        <span className="font-medium">
                          {location.name.trim()}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {`${
                            location.state ? location.state.trim() + " - " : ""
                          }${location.country.trim()}`}
                        </span>
                        
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                          {format(location.searchedAt, "dd/MM/yy h:mm a")}
                        </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Sugestões">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => {
                return (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}| ${
                      location.state || ""
                    } | ${location.country}`}
                    onSelect={handleSelect}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {location.name.trim()}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {`${
                          location.state ? location.state.trim() + " - " : ""
                        }${location.country.trim()}`}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
