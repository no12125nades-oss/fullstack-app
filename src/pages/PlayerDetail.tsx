import { trpc } from "@/providers/trpc";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Crosshair,
  Shield,
  User,
  TrendingUp,
  Map,
  Star,
} from "lucide-react";

function getFlagEmoji(flagCode: string) {
  if (!flagCode) return "";
  const codePoints = flagCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const playerId = parseInt(id || "0");

  const { data: player, isLoading } = trpc.player.getById.useQuery({ id: playerId });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-muted-foreground">
        Loading player...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground mb-4">Player not found</p>
        <Button asChild>
          <Link to="/rankings">Back to Rankings</Link>
        </Button>
      </div>
    );
  }

  const stats = [
    { label: "Rating 2.0", value: parseFloat(player.rating || "0"), max: 2, icon: Star, color: "text-yellow-500" },
    { label: "Kills Per Round", value: parseFloat(player.kpr || "0"), max: 1.5, icon: Crosshair, color: "text-green-500" },
    { label: "Deaths Per Round", value: parseFloat(player.dpr || "0"), max: 1.5, icon: Shield, color: "text-red-500" },
    { label: "ADR", value: parseFloat(player.adr || "0"), max: 150, icon: Target, color: "text-blue-500" },
    { label: "KAST", value: parseFloat(player.kast || "0"), max: 100, icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={`/team/${player.teamId}`}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Team
        </Link>
      </Button>

      {/* Player Header */}
      <Card className="border-border/50 mb-6 overflow-hidden">
        <div className="relative bg-gradient-to-br from-[#15171e] to-[#1a1d2e]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8">
            <div className="relative">
              <img
                src={player.photo || "/assets/players/player1.png"}
                alt={player.gameName}
                className="w-32 h-40 object-cover rounded-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                <span className="text-2xl">{getFlagEmoji(player.flag || "")}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{player.gameName}</h1>
              </div>
              <p className="text-muted-foreground mb-3">{player.realName}</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {player.role}
                </Badge>
                {player.age && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {player.age} years
                  </Badge>
                )}
                {player.team && (
                  <Link to={`/team/${player.teamId}`}>
                    <Badge variant="outline" className="flex items-center gap-1 hover:bg-accent cursor-pointer">
                      <img src={player.team.logo || ""} alt="" className="w-4 h-4 object-contain" />
                      {player.team.name}
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Main Stats */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const percentage = Math.min((stat.value / stat.max) * 100, 100);
              return (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{stat.value}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Map className="h-5 w-5 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
              Career Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]">
                  {player.mapsPlayed}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Maps Played</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]">
                  {player.rating}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Rating 2.0</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-green-500">{player.kpr}</div>
                <div className="text-xs text-muted-foreground mt-1">KPR</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-3xl font-bold text-blue-500">{player.adr}</div>
                <div className="text-xs text-muted-foreground mt-1">ADR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
