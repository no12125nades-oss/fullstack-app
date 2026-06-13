import { useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Swords,
  Trophy,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6 text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage teams, players, matches, and rankings
        </p>
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="mb-6">
          <TabsTrigger value="teams" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-1.5">
            <Swords className="h-3.5 w-3.5" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="players" className="gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <TeamsAdmin />
        </TabsContent>
        <TabsContent value="matches">
          <MatchesAdmin />
        </TabsContent>
        <TabsContent value="players">
          <PlayersAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TeamsAdmin() {
  const { data: teams, isLoading } = trpc.team.list.useQuery();
  const utils = trpc.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", region: "", logo: "", description: "", coachName: "", coachFlag: "", points: "0",
  });

  const createTeam = trpc.admin.teamCreate.useMutation({
    onSuccess: () => {
      utils.team.list.invalidate();
      setIsOpen(false);
      setFormData({ name: "", region: "", logo: "", description: "", coachName: "", coachFlag: "", points: "0" });
    },
  });

  const deleteTeam = trpc.admin.teamDelete.useMutation({
    onSuccess: () => utils.team.list.invalidate(),
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Teams Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={formData.region} onValueChange={v => setFormData({ ...formData, region: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Europe", "North America", "Asia", "South America", "CIS", "Oceania"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })} placeholder="/assets/teams/team1.png" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Coach Name</Label>
                <Input value={formData.coachName} onChange={e => setFormData({ ...formData, coachName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input type="number" value={formData.points} onChange={e => setFormData({ ...formData, points: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => createTeam.mutate({
                name: formData.name,
                region: formData.region,
                logo: formData.logo || undefined,
                description: formData.description || undefined,
                coachName: formData.coachName || undefined,
                points: parseInt(formData.points) || 0,
              })}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Team</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Region</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Points</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams?.map((team) => (
                  <tr key={team.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-2 px-3 text-sm">{team.id}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <img src={team.logo || ""} alt="" className="w-6 h-6 object-contain" />
                        <span className="text-sm font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">{team.region}</td>
                    <td className="py-2 px-3 text-sm text-right">{team.points}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => deleteTeam.mutate({ id: team.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MatchesAdmin() {
  const { data: matches, isLoading } = trpc.match.list.useQuery();
  const { data: teams } = trpc.team.list.useQuery();
  const utils = trpc.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    teamAId: "", teamBId: "", matchType: "BO3", status: "upcoming" as "upcoming" | "ongoing" | "finished",
    mapName: "", eventName: "",
  });

  const createMatch = trpc.admin.matchCreate.useMutation({
    onSuccess: () => {
      utils.match.list.invalidate();
      setIsOpen(false);
    },
  });

  const deleteMatch = trpc.admin.matchDelete.useMutation({
    onSuccess: () => utils.match.list.invalidate(),
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Matches Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team A</Label>
                <Select value={formData.teamAId} onValueChange={v => setFormData({ ...formData, teamAId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teams?.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team B</Label>
                <Select value={formData.teamBId} onValueChange={v => setFormData({ ...formData, teamBId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teams?.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Match Type</Label>
                <Select value={formData.matchType} onValueChange={v => setFormData({ ...formData, matchType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["BO1", "BO3", "BO5"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["upcoming", "ongoing", "finished"].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Map</Label>
                <Input value={formData.mapName} onChange={e => setFormData({ ...formData, mapName: e.target.value })} placeholder="Mirage" />
              </div>
              <div className="space-y-2">
                <Label>Event</Label>
                <Input value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} placeholder="EFL Major" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={() => createMatch.mutate({
                teamAId: parseInt(formData.teamAId),
                teamBId: parseInt(formData.teamBId),
                matchType: formData.matchType,
                status: formData.status,
                mapName: formData.mapName || undefined,
                eventName: formData.eventName || undefined,
              })}>
                Create Match
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Match</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Score</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches?.map((match) => {
                  const teamA = teams?.find(t => t.id === match.teamAId);
                  const teamB = teams?.find(t => t.id === match.teamBId);
                  return (
                    <tr key={match.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 text-sm">{match.id}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{teamA?.name}</span>
                          <span className="text-xs text-muted-foreground">vs</span>
                          <span className="text-sm">{teamB?.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm text-center font-mono">
                        {match.teamAScore} - {match.teamBScore}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          match.status === "ongoing" ? "bg-red-500/10 text-red-500" :
                          match.status === "finished" ? "bg-green-500/10 text-green-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {match.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteMatch.mutate({ id: match.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
  );
}

function PlayersAdmin() {
  const { data: players, isLoading } = trpc.player.list.useQuery();
  const { data: teams } = trpc.team.list.useQuery();
  const utils = trpc.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    teamId: "", gameName: "", realName: "", role: "", age: "", flag: "",
  });

  const createPlayer = trpc.admin.playerCreate.useMutation({
    onSuccess: () => {
      utils.player.list.invalidate();
      setIsOpen(false);
    },
  });

  const deletePlayer = trpc.admin.playerDelete.useMutation({
    onSuccess: () => utils.player.list.invalidate(),
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Players Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={formData.teamId} onValueChange={v => setFormData({ ...formData, teamId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teams?.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Game Name</Label>
                <Input value={formData.gameName} onChange={e => setFormData({ ...formData, gameName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Real Name</Label>
                <Input value={formData.realName} onChange={e => setFormData({ ...formData, realName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["AWPer", "IGL", "Entry Fragger", "Support", "Lurker"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={() => createPlayer.mutate({
                teamId: parseInt(formData.teamId),
                gameName: formData.gameName,
                realName: formData.realName || undefined,
                role: formData.role || undefined,
                age: formData.age ? parseInt(formData.age) : undefined,
              })}>
                Create Player
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Player</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Team</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Role</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Rating</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players?.map((player) => {
                  const team = teams?.find(t => t.id === player.teamId);
                  return (
                    <tr key={player.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 text-sm">{player.id}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img src={player.photo || "/assets/players/player1.png"} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="text-sm font-medium">{player.gameName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">{team?.name || "-"}</td>
                      <td className="py-2 px-3 text-sm">{player.role}</td>
                      <td className="py-2 px-3 text-sm text-right font-semibold">{player.rating}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => deletePlayer.mutate({ id: player.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
  );
}
