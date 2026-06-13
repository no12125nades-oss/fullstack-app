import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus, Globe, Filter } from "lucide-react";
import { useState } from "react";

function TrendIcon({ trend }: { trend: string }) {
  if (trend.startsWith("+")) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (trend.startsWith("-")) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
}

export default function Rankings() {
  const { data: rankingsData, isLoading } = trpc.ranking.currentWeek.useQuery();
  const { data: teamsData } = trpc.team.list.useQuery();
  const [regionFilter, setRegionFilter] = useState<string>("");

  const regions = [...new Set(teamsData?.map(t => t.region) || [])];

  const filteredRankings = rankingsData?.filter(r => {
    if (!regionFilter) return true;
    const team = teamsData?.find(t => t.id === r.teamId);
    return team?.region === regionFilter;
  });

  const top3 = filteredRankings?.slice(0, 3) || [];
  const rest = filteredRankings?.slice(3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-6 w-6 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
          <h1 className="text-3xl font-bold">CS2 Global Rankings</h1>
        </div>
        <p className="text-muted-foreground">
          Global Team Rankings - Week 42
        </p>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => setRegionFilter("")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            !regionFilter ? "bg-[#00f0ff]/10 text-[#00f0ff] dark:bg-[#00f0ff]/10 dark:text-[#00f0ff] bg-[#3b82f6]/10 text-[#3b82f6]" : "text-muted-foreground hover:bg-accent"
          }`}
        >
          All Regions
        </button>
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
              regionFilter === region ? "bg-[#00f0ff]/10 text-[#00f0ff] dark:bg-[#00f0ff]/10 dark:text-[#00f0ff] bg-[#3b82f6]/10 text-[#3b82f6]" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <Globe className="h-3 w-3" />
            {region}
          </button>
        ))}
      </div>

      {/* Top 3 Teams */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {top3.map((team, idx) => {
            const medals = ["bg-yellow-500/10 border-yellow-500/30", "bg-gray-400/10 border-gray-400/30", "bg-amber-600/10 border-amber-600/30"];
            const medalsDark = ["dark:bg-yellow-500/10 dark:border-yellow-500/30", "dark:bg-gray-400/10 dark:border-gray-400/30", "dark:bg-amber-600/10 dark:border-amber-600/30"];
            return (
              <Link
                key={team.teamId}
                to={`/team/${team.teamId}`}
                className={`p-6 rounded-xl border ${medals[idx]} ${medalsDark[idx]} hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-lg font-bold border-0 bg-transparent">
                    #{team.position}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={team.trend || "0"} />
                    <span className="text-xs text-muted-foreground">{team.trend}</span>
                  </div>
                </div>
                <div className="text-center">
                  <img
                    src={team.teamLogo || "/assets/teams/team1.png"}
                    alt={team.teamName}
                    className="w-16 h-16 object-contain mx-auto mb-3"
                  />
                  <h3 className="text-lg font-bold">{team.teamName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{team.points} points</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading rankings...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Team</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((team) => {
                    const teamInfo = teamsData?.find(t => t.id === team.teamId);
                    return (
                      <tr key={team.teamId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-sm font-bold tabular-nums">{team.position}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Link to={`/team/${team.teamId}`} className="flex items-center gap-3 hover:text-[#00f0ff] dark:hover:text-[#00f0ff] hover:text-[#3b82f6] transition-colors">
                            <img src={team.teamLogo || "/assets/teams/team1.png"} alt="" className="w-8 h-8 object-contain" />
                            <span className="font-medium">{team.teamName}</span>
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {teamInfo?.region || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold tabular-nums">
                          {team.points} pts
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <TrendIcon trend={team.trend || "0"} />
                            <span className="text-xs text-muted-foreground">{team.trend}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
