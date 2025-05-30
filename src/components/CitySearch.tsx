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
import { Loader2, Search, SearchIcon } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);

  const handleSelect = (cityData:string) => {
    const [lat, lon, name, country] = cityData.split("|");
    
    setOpen(false);
    navigate(`/city/${name}??lat=${lat}&lon=${lon}`);
  };

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
          <CommandGroup heading="Favoritos">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Histórico de pesquisa">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>
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
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <span >{location.name}</span>
                    {location.state &&(
                      <span className="text-muted-foreground text-sm">
                        , {location.state}
                        </span>
                    )}
                    <span className="text-muted-foreground text-sm">
                    - {location.country}
                        </span>
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
