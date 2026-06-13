import { getDb } from "../api/queries/connection";
import { teams, players, matches, rankings } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(rankings);
  await db.delete(matches);
  await db.delete(players);
  await db.delete(teams);
  console.log("Cleared existing data");

  // Seed teams
  const teamsData = [
    { name: "Neon Wolves", logo: "/assets/teams/team1.png", region: "Europe", description: "Elite European esports organization founded in 2019", valveRanking: 111, worldRanking: 84, weeksInTop30: 12, averagePlayerAge: "22.4", coachName: "NightWatch", coachFlag: "SE", coachRealName: "Erik Lindqvist", points: 1245, trend: "+1" },
    { name: "Storm Eagles", logo: "/assets/teams/team2.png", region: "North America", description: "Dominant NA squad with multiple championship titles", valveRanking: 89, worldRanking: 42, weeksInTop30: 28, averagePlayerAge: "23.1", coachName: "SkyLord", coachFlag: "US", coachRealName: "Michael Torres", points: 1201, trend: "0" },
    { name: "Inferno Dragons", logo: "/assets/teams/team3.png", region: "Europe", description: "Aggressive European roster known for fast plays", valveRanking: 45, worldRanking: 15, weeksInTop30: 35, averagePlayerAge: "21.8", coachName: "BlazeKing", coachFlag: "UA", coachRealName: "Dmytro Shevchenko", points: 1180, trend: "-2" },
    { name: "Phoenix Rising", logo: "/assets/teams/team4.png", region: "Asia", description: "Top Asian team with rising international presence", valveRanking: 67, worldRanking: 28, weeksInTop30: 18, averagePlayerAge: "20.6", coachName: "EmberSoul", coachFlag: "KR", coachRealName: "Park Ji-hoon", points: 1156, trend: "+3" },
    { name: "Venom Cobras", logo: "/assets/teams/team5.png", region: "South America", description: "Brazilian powerhouse with tactical excellence", valveRanking: 34, worldRanking: 8, weeksInTop30: 42, averagePlayerAge: "22.0", coachName: "Toxin", coachFlag: "BR", coachRealName: "Rafael Silva", points: 1120, trend: "-1" },
    { name: "Iron Bears", logo: "/assets/teams/team6.png", region: "CIS", description: "CIS region dominant force with strong fundamentals", valveRanking: 22, worldRanking: 5, weeksInTop30: 50, averagePlayerAge: "23.5", coachName: "Grizzly", coachFlag: "RU", coachRealName: "Ivan Volkov", points: 1089, trend: "+2" },
    { name: "Thunder Lions", logo: "/assets/teams/team7.png", region: "Europe", description: "Scandinavian tactical masterminds", valveRanking: 15, worldRanking: 3, weeksInTop30: 45, averagePlayerAge: "24.1", coachName: "Roar", coachFlag: "DK", coachRealName: "Lars Jensen", points: 1070, trend: "-1" },
    { name: "Shadow Ravens", logo: "/assets/teams/team8.png", region: "North America", description: "Stealthy NA squad with unpredictable strategies", valveRanking: 56, worldRanking: 31, weeksInTop30: 15, averagePlayerAge: "21.3", coachName: "DarkWing", coachFlag: "CA", coachRealName: "James Blackwood", points: 1045, trend: "+1" },
  ];

  const insertedTeams = [];
  for (const team of teamsData) {
    const [result] = await db.insert(teams).values(team).$returningId();
    const inserted = await db.select().from(teams).where(eq(teams.id, result.id));
    insertedTeams.push(inserted[0]);
  }
  console.log(`Inserted ${insertedTeams.length} teams`);

  // Seed players for each team
  const playerNames = [
    ["SHiNE", "tAk", "hitori", "Junyme", "yksjupe"],
    ["Eagle", "Soar", "Talon", "Wing", "Feather"],
    ["Blaze", "Ember", "Spark", "Flame", "Ash"],
    ["Rise", "Rebirth", "Glow", "Heat", "Sparkle"],
    ["Viper", "Fang", "Strike", "Hiss", "Scale"],
    ["Claw", "Roar", "Paw", "Fur", "Growl"],
    ["Mane", "Pride", "Savanna", "Hunt", "Roar"],
    ["Shadow", "Dark", "Mist", "Night", "Crow"],
  ];

  const realNames = [
    ["Alex Novak", "Timo Berg", "Riku Johansson", "Lucas Weber", "Joonas Maki"],
    ["Tyler Reed", "Chris Park", "Brandon Lee", "Marcus Johnson", "Ryan Chen"],
    ["Artem Koval", "Bogdan Petrov", "Maksym Rybak", "Oleksandr Bondar", "Yaroslav Kovalenko"],
    ["Min-jae Kim", "Tae-woo Lee", "Sung-ho Park", "Jin-wook Choi", "Hyun-woo Jung"],
    ["Pedro Costa", "Lucas Oliveira", "Gabriel Santos", "Matheus Lima", "Rafael Ferreira"],
    ["Dmitri Kuznetsov", "Andrei Popov", "Sergei Volkov", "Mikhail Sokolov", "Nikolai Fedorov"],
    ["Erik Lindqvist", "Lars Nielsen", "Bjorn Andersson", "Magnus Eriksson", "Henrik Johansson"],
    ["Ethan Williams", "Noah Thompson", "Liam Davis", "Owen Wilson", "Caleb Martin"],
  ];

  const flags = ["SE", "DE", "FI", "AT", "DK", "US", "KR", "UA", "BR", "RU", "CA", "GB"];
  const roles = ["AWPer", "IGL", "Entry Fragger", "Support", "Lurker"];
  const photos = ["/assets/players/player1.png", "/assets/players/player2.png", "/assets/players/player3.png", "/assets/players/player4.png"];

  let playerCount = 0;
  for (let t = 0; t < insertedTeams.length; t++) {
    const team = insertedTeams[t];
    for (let p = 0; p < 5; p++) {
      await db.insert(players).values({
        teamId: team.id,
        gameName: playerNames[t][p],
        realName: realNames[t][p],
        photo: photos[p % photos.length],
        flag: flags[(t + p) % flags.length],
        role: roles[p],
        age: 18 + Math.floor(Math.random() * 8),
        rating: (0.85 + Math.random() * 0.4).toFixed(2),
        kpr: (0.5 + Math.random() * 0.3).toFixed(2),
        dpr: (0.55 + Math.random() * 0.25).toFixed(2),
        adr: (65 + Math.random() * 30).toFixed(1),
        kast: (65 + Math.random() * 20).toFixed(1),
        mapsPlayed: 50 + Math.floor(Math.random() * 150),
      });
      playerCount++;
    }
  }
  console.log(`Inserted ${playerCount} players`);

  // Seed matches
  const matchTypes = ["BO1", "BO3", "BO3", "BO5"];
  const maps = ["Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Vertigo", "Anubis"];
  const events = ["EFL Major", "Champions Cup", "Pro League", "Regional Finals", "Qualifier"];

  const now = new Date();
  const matchesData = [];

  // Create some ongoing matches
  for (let i = 0; i < 2; i++) {
    const teamA = insertedTeams[i * 2];
    const teamB = insertedTeams[i * 2 + 1];
    matchesData.push({
      teamAId: teamA.id,
      teamBId: teamB.id,
      teamAScore: Math.floor(Math.random() * 10),
      teamBScore: Math.floor(Math.random() * 10),
      status: "ongoing" as const,
      matchType: matchTypes[1],
      scheduledAt: new Date(now.getTime() - 30 * 60000),
      mapName: maps[i % maps.length],
      eventName: events[0],
    });
  }

  // Create some upcoming matches
  for (let i = 0; i < 4; i++) {
    const teamA = insertedTeams[i % insertedTeams.length];
    const teamB = insertedTeams[(i + 2) % insertedTeams.length];
    matchesData.push({
      teamAId: teamA.id,
      teamBId: teamB.id,
      teamAScore: 0,
      teamBScore: 0,
      status: "upcoming" as const,
      matchType: matchTypes[i % matchTypes.length],
      scheduledAt: new Date(now.getTime() + (i + 1) * 3600000),
      mapName: maps[i % maps.length],
      eventName: events[i % events.length],
    });
  }

  // Create some finished matches
  for (let i = 0; i < 6; i++) {
    const teamA = insertedTeams[i % insertedTeams.length];
    const teamB = insertedTeams[(i + 3) % insertedTeams.length];
    const scoreA = 10 + Math.floor(Math.random() * 6);
    const scoreB = 10 + Math.floor(Math.random() * 6);
    matchesData.push({
      teamAId: teamA.id,
      teamBId: teamB.id,
      teamAScore: Math.max(scoreA, scoreB),
      teamBScore: Math.min(scoreA, scoreB),
      status: "finished" as const,
      matchType: matchTypes[i % matchTypes.length],
      scheduledAt: new Date(now.getTime() - (i + 1) * 86400000),
      finishedAt: new Date(now.getTime() - (i + 1) * 86400000 + 2 * 3600000),
      mapName: maps[i % maps.length],
      eventName: events[i % events.length],
    });
  }

  for (const match of matchesData) {
    await db.insert(matches).values(match);
  }
  console.log(`Inserted ${matchesData.length} matches`);

  // Seed rankings for current week
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((currentDate.getTime() - startOfYear.getTime()) / 604800000);

  for (let i = 0; i < insertedTeams.length; i++) {
    await db.insert(rankings).values({
      teamId: insertedTeams[i].id,
      position: i + 1,
      points: insertedTeams[i].points,
      trend: insertedTeams[i].trend,
      week: weekNumber,
      year: currentDate.getFullYear(),
    });
  }
  console.log(`Inserted ${insertedTeams.length} rankings`);

  console.log("Seed complete!");
}

seed().catch(console.error);
