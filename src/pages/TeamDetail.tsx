import { trpc } from "@/providers/trpc";
import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Globe,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Swords,
} from "lucide-react";

function getFlagEmoji(flagCode: string) {
  if (!flagCode) return "";
  const codePoints = flagCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend.startsWith("+")) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend.startsWith("-")) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || "0");

  const { data: team, isLoading } = trpc.team.getById.useQuery({ id: teamId });
  const { data: teamMatches } = trpc.team.getMatches.useQuery({ id: teamId });
  const { data: teamsData } = trpc.team.list.useQuery();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-muted-foreground">
        Loading team...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground mb-4">Team not found</p>
        <Button asChild>
          <Link to="/rankings">Back to Rankings</Link>
        </Button>
      </div>
    );
  }

  const players = team.players || [];
  const matches = teamMatches || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/rankings">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Rankings
        </Link>
      </Button>

      {/* Team Header */}
      <Card className="border-border/50 mb-6 overflow-hidden">
        <div className="relative bg-gradient-to-br from-[#15171e] to-[#1a1d2e] p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={team.logo || "/assets/teams/team1.png"}
              alt={team.name}
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {team.region}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xl">{team.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Valve Ranking:</span>
                  <span className="font-semibold">#{team.valveRanking}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">World Ranking:</span>
                  <span className="font-semibold">#{team.worldRanking}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Points:</span>
                  <span className="font-semibold">{team.points}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendIcon trend={team.trend || "0"} />
                  <span className="text-muted-foreground">{team.trend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border/50 divide-x divide-border/50">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold">{team.weeksInTop30}</div>
            <div className="text-xs text-muted-foreground mt-1">Weeks in Top 30</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold">{team.averagePlayerAge}</div>
            <div className="text-xs text-muted-foreground mt-1">Avg Player Age</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold">{players.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Players</div>
          </div>
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{getFlagEmoji(team.coachFlag || "")}</span>
              <span className="text-sm font-medium">{team.coachName}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Coach</div>
          </div>
        </div>
      </Card>

      {/* Players Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
          <h2 className="text-xl font-bold">Roster</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {players.map((player) => (
            <Link key={player.id} to={`/player/${player.id}`}>
              <Card className="border-border/50 hover:border-[#00f0ff]/30 dark:hover:border-[#00f0ff]/30 hover:border-[#3b82f6]/30 transition-all hover:scale-[1.02] cursor-pointer overflow-hidden">
                <div className="relative">
                  <img
                    src={player.photo || "/assets/players/player1.png"}
                    alt={player.gameName}
                    className="w-full h-40 object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getFlagEmoji(player.flag || "")}</span>
                      <span className="text-white font-bold text-sm">{player.gameName}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground mb-2">{player.realName}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-3 w-3" />
                      {player.role}
                    </span>
                    <span className="font-semibold">Rating: {player.rating}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Matches */}
      {matches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Swords className="h-5 w-5 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
            <h2 className="text-xl font-bold">Recent Matches</h2>
          </div>
          <div className="space-y-2">
            {matches.slice(0, 5).map((match) => {
              const oppId = match.teamAId === teamId ? match.teamBId : match.teamAId;
              const opp = teamsData?.find(t => t.id === oppId);
              const isTeamA = match.teamAId === teamId;
              const teamScore = isTeamA ? match.teamAScore : match.teamBScore;
              const oppScore = isTeamA ? match.teamBScore : match.teamAScore;
              const won = (teamScore ?? 0) > (oppScore ?? 0);

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={won ? "default" : "destructive"} className="text-xs">
                      {won ? "W" : "L"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">vs</span>
                    <div className="flex items-center gap-2">
                      <img src={opp?.logo || ""} alt="" className="w-6 h-6 object-contain" />
                      <span className="font-medium text-sm">{opp?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{match.mapName}</span>
                    <span className={`font-bold tabular-nums ${won ? "text-green-500" : "text-red-500"}`}>
                      {teamScore ?? 0} - {oppScore ?? 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
