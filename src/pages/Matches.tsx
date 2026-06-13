import { trpc } from "@/providers/trpc";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, Clock, Calendar, CheckCircle, MapPin, Trophy } from "lucide-react";

export default function Matches() {
  const { data: ongoingMatches, isLoading: ongoingLoading } = trpc.match.getOngoing.useQuery();
  const { data: upcomingMatches, isLoading: upcomingLoading } = trpc.match.getUpcoming.useQuery();
  const { data: recentMatches, isLoading: recentLoading } = trpc.match.getRecent.useQuery();
  const { data: teamsData } = trpc.team.list.useQuery();

  function MatchCard({ match }: { match: any }) {
    const teamA = teamsData?.find(t => t.id === match.teamAId);
    const teamB = teamsData?.find(t => t.id === match.teamBId);
    const isOngoing = match.status === "ongoing";
    const isFinished = match.status === "finished";

    return (
      <div className="p-4 rounded-lg bg-card border border-border/50 hover:border-[#00f0ff]/30 dark:hover:border-[#00f0ff]/30 hover:border-[#3b82f6]/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isOngoing && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
            <Badge variant="outline" className="text-xs">
              {match.matchType || "BO3"}
            </Badge>
            {match.eventName && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {match.eventName}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium ${
            isOngoing ? "text-red-500" : isFinished ? "text-green-500" : "text-muted-foreground"
          }`}>
            {isOngoing ? "LIVE" : isFinished ? "Finished" : "Upcoming"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <img src={teamA?.logo || ""} alt="" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-semibold text-sm">{teamA?.name || "Team A"}</div>
              <div className="text-xs text-muted-foreground">{teamA?.region}</div>
            </div>
          </div>

          <div className="flex flex-col items-center px-4">
            <div className="text-xl font-bold tabular-nums">
              {match.teamAScore} - {match.teamBScore}
            </div>
            {match.mapName && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {match.mapName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <div className="font-semibold text-sm">{teamB?.name || "Team B"}</div>
              <div className="text-xs text-muted-foreground">{teamB?.region}</div>
            </div>
            <img src={teamB?.logo || ""} alt="" className="w-10 h-10 object-contain" />
          </div>
        </div>

        {match.scheduledAt && (
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(match.scheduledAt).toLocaleString()}
            </span>
            {isFinished && match.finishedAt && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Ended {new Date(match.finishedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Swords className="h-6 w-6 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
          <h1 className="text-3xl font-bold">Matches</h1>
        </div>
        <p className="text-muted-foreground">Track live, upcoming, and past matches</p>
      </div>

      <Tabs defaultValue="ongoing">
        <TabsList className="mb-6">
          <TabsTrigger value="ongoing" className="gap-1.5">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-3">
          {ongoingLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : ongoingMatches && ongoingMatches.length > 0 ? (
            ongoingMatches.map(match => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No ongoing matches at the moment
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          {upcomingLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : upcomingMatches && upcomingMatches.length > 0 ? (
            upcomingMatches.map(match => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No upcoming matches scheduled
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-3">
          {recentLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentMatches && recentMatches.length > 0 ? (
            recentMatches.map(match => <MatchCard key={match.id} match={match} />)
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No finished matches yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
