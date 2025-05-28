import type { UviData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Glasses, ShieldAlert, TriangleAlert } from "lucide-react";

interface UvIndexProps {
  data: UviData;
}

const getUvLevel = (value: number) => {
  if (value <= 2)
    return {
      label: "Baixo",
      color: "text-green-500",
      message: "Sem risco. Aproveite o dia com segurança.",
    };
  if (value <= 5)
    return {
      label: "Moderado",
      color: "text-yellow-500",
      message: "Use protetor solar e óculos escuros se for ficar ao ar livre.",
    };
  if (value <= 7)
    return {
      label: "Alto",
      color: "text-orange-500",
      message:
        "Use protetor solar, óculos escuros e chapéu. Evite o sol ao meio-dia.",
    };
  if (value <= 10)
    return {
      label: "Muito Alto",
      color: "text-red-500",
      message:
        "Evite exposição prolongada. Use proteção forte e fique na sombra.",
    };
  return {
    label: "Extremo",
    color: "text-purple-700",
    message: "Evite sair ao sol, proteção total é essencial.",
  };
};

const UvIndex = ({ data }: UvIndexProps) => {
  const { value } = data;
  const { label, color, message } = getUvLevel(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Índice UV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Glasses className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-sm font-medium leading-none">Índice</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <TriangleAlert className={`h-6 w-6 ${color}`} />
            <div>
              <p className="text-sm font-medium leading-none">Risco</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
          <div className="sm:col-span-2 gap-3 rounded-lg border p-4">
            <p className="flex items-center gap-2 text-sm font-medium leading-none">
              <ShieldAlert className="h-6 w-6 text-red-500" />
              Recomendação
            </p>
            <p className="text-lg mt-2 text-muted-foreground">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UvIndex;
