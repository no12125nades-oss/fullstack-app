import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, ChevronRight, Swords, TrendingUp, TrendingDown, Minus } from "lucide-react";

function TrendIcon({ trend }: { trend: string }) {
  if (trend.startsWith("+")) return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (trend.startsWith("-")) return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-gray-400" />;
}

export default function Home() {
  const { data: ongoingMatches } = trpc.match.getOngoing.useQuery();
  const { data: upcomingMatches } = trpc.match.getUpcoming.useQuery();
  const { data: recentMatches } = trpc.match.getRecent.useQuery();
  const { data: rankingsData } = trpc.ranking.currentWeek.useQuery();
  const { data: teamsData } = trpc.team.list.useQuery();

  const topTeams = rankingsData?.slice(0, 5) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-[#0b0c10] via-[#15171e] to-[#1a1d2e] border border-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative p-8 md:p-12">
          <Badge variant="outline" className="mb-4 border-[#00f0ff]/50 text-[#00f0ff]">
            <Trophy className="h-3 w-3 mr-1" />
            Championship Series
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            EFL Championship Series
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            Witness the world's top teams compete for the ultimate title. Follow live matches, track rankings, and explore player statistics.
          </p>
          <div className="flex gap-3">
            <Link
              to="/matches"
              className="inline-flex items-center px-5 py-2.5 bg-[#00f0ff] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Swords className="h-4 w-4 mr-2" />
              Watch Matches
            </Link>
            <Link
              to="/rankings"
              className="inline-flex items-center px-5 py-2.5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              View Rankings
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Matches */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ongoing Matches */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                Ongoing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ongoingMatches && ongoingMatches.length > 0 ? (
                ongoingMatches.slice(0, 3).map((match) => {
                  const teamA = teamsData?.find(t => t.id === match.teamAId);
                  const teamB = teamsData?.find(t => t.id === match.teamBId);
                  return (
                    <Link
                      key={match.id}
                      to={`/matches`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {teamA?.logo ? (
                          <img src={teamA.logo} alt={teamA.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/20" />
                        )}
                        <span className="text-sm font-medium truncate">{teamA?.name || "Team A"}</span>
                      </div>
                      <div className="px-3 py-1 bg-background rounded-md font-bold text-sm tabular-nums">
                        {match.teamAScore ?? 0} - {match.teamBScore ?? 0}
                      </div>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-medium truncate">{teamB?.name || "Team B"}</span>
                        {teamB?.logo ? (
                          <img src={teamB.logo} alt={teamB.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/20" />
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No ongoing matches</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Matches */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#00f0ff]" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMatches && upcomingMatches.length > 0 ? (
                upcomingMatches.slice(0, 4).map((match) => {
                  const teamA = teamsData?.find(t => t.id === match.teamAId);
                  const teamB = teamsData?.find(t => t.id === match.teamBId);
                  return (
                    <Link
                      key={match.id}
                      to="/matches"
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {teamA?.logo ? (
                          <img src={teamA.logo} alt={teamA.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/20" />
                        )}
                        <span className="text-sm font-medium truncate">{teamA?.name || "Team A"}</span>
                      </div>
                      <div className="text-xs text-muted-foreground px-2">vs</div>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-medium truncate">{teamB?.name || "Team B"}</span>
                        {teamB?.logo ? (
                          <img src={teamB.logo} alt={teamB.name} className="w-7 h-7 object-contain" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/20" />
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming matches</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Rankings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Global Team Rankings</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">WEEK 42</p>
              </div>
              <Link
                to="/rankings"
                className="text-sm text-[#00f0ff] hover:underline flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {/* Top 3 Teams */}
              {topTeams.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {topTeams.slice(0, 3).map((team, idx) => {
                    const borderColors = ["border-yellow-500/50", "border-gray-400/50", "border-amber-600/50"];
                    const glowColors = ["shadow-yellow-500/10", "shadow-gray-400/10", "shadow-amber-600/10"];
                    return (
                      <Link
                        key={team.teamId}
                        to={`/team/${team.teamId}`}
                        className={`p-4 rounded-lg border ${borderColors[idx]} bg-card hover:bg-accent/50 transition-all shadow-lg ${glowColors[idx]} text-center`}
                      >
                        <div className="text-2xl font-bold text-muted-foreground mb-2">#{team.position}</div>
                        <img
                          src={team.teamLogo || "/assets/teams/team1.png"}
                          alt={team.teamName}
                          className="w-12 h-12 object-contain mx-auto mb-2"
                        />
                        <div className="font-semibold text-sm truncate">{team.teamName}</div>
                        <div className="text-xs text-muted-foreground mt-1">{team.points} pts</div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Rankings Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Pos</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Team</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Points</th>
                      <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTeams.slice(3).map((team) => (
                      <tr key={team.teamId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3 text-sm font-semibold tabular-nums">{team.position}</td>
                        <td className="py-2.5 px-3">
                          <Link to={`/team/${team.teamId}`} className="flex items-center gap-2 hover:text-[#00f0ff] transition-colors">
                            <img src={team.teamLogo || "/assets/teams/team1.png"} alt="" className="w-6 h-6 object-contain" />
                            <span className="text-sm font-medium">{team.teamName}</span>
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-right tabular-nums">{team.points} pts</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <TrendIcon trend={team.trend || "0"} />
                            <span className="text-xs text-muted-foreground">{team.trend}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentMatches?.slice(0, 4).map((match) => {
                  const teamA = teamsData?.find(t => t.id === match.teamAId);
                  const teamB = teamsData?.find(t => t.id === match.teamBId);
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/30"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <img src={teamA?.logo || ""} alt="" className="w-6 h-6 object-contain" />
                        <span className={`text-sm font-medium ${(match.teamAScore ?? 0) > (match.teamBScore ?? 0) ? "text-green-500" : ""}`}>
                          {teamA?.name}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-background rounded font-bold text-sm tabular-nums mx-2">
                        {match.teamAScore ?? 0} - {match.teamBScore ?? 0}
                      </div>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className={`text-sm font-medium ${(match.teamBScore ?? 0) > (match.teamAScore ?? 0) ? "text-green-500" : ""}`}>
                          {teamB?.name}
                        </span>
                        <img src={teamB?.logo || ""} alt="" className="w-6 h-6 object-contain" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
