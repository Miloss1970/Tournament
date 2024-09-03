import { Team } from "./Team.js";
import { Match } from "./Match.js";

export class Group {
  constructor(name, teams) {
    this.name = name;
    this.teams = teams.map(
      (t) => new Team(t.Team, t.ISOCode, t.FIBARanking, name)
    );
    this.matches = [];
  }

  simulateMatches() {
    const rounds = [
      [
        [0, 2],
        [1, 3],
      ],
      [
        [0, 3],
        [1, 2],
      ],
      [
        [0, 1],
        [2, 3],
      ],
    ];

    rounds.forEach((round, roundIndex) => {
      round.forEach(([teamAIndex, teamBIndex]) => {
        const match = Match.simulateMatch(
          this.teams[teamAIndex],
          this.teams[teamBIndex]
        );
        match.round = roundIndex + 1;
        this.matches.push(match);
        match.updateTeamStats();
      });
    });
  }

  getStandings() {
    return this.teams.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;

      const headToHead = this.getHeadToHeadResult(a, b);
      if (headToHead !== 0) return headToHead;

      const threeTeamsWithTheSamePoints = this.checkTheSamePoints(a);
      if (threeTeamsWithTheSamePoints.length === 3) {
        return this.resolveThreeTeams(threeTeamsWithTheSamePoints, a, b);
      }

      return (
        b.scoredPoints - b.concededPoints - (a.scoredPoints - a.concededPoints)
      );
    });
  }

  getHeadToHeadResult(teamA, teamB) {
    const match = this.matches.find(
      (m) =>
        (m.teamA === teamA && m.teamB === teamB) ||
        (m.teamA === teamB && m.teamB === teamA)
    );

    if (!match) return 0;

    const teamAScore = match.teamA === teamA ? match.scoreA : match.scoreB;
    const teamBScore = match.teamA === teamA ? match.scoreB : match.scoreA;

    return teamAScore > teamBScore ? -1 : 1;
  }

  checkTheSamePoints(teamA) {
    return this.teams.filter((team) => team.points === teamA.points);
  }

  resolveThreeTeams(tiedTeams, teamA, teamB) {
    const scores = {};

    tiedTeams.forEach((team) => {
      scores[team.name] = 0;
    });

    this.matches.forEach((match) => {
      const isTeam1 = tiedTeams.some((team) => team.name === match.team1.name);
      const isTeam2 = tiedTeams.some((team) => team.name === match.team2.name);

      if (isTeam1 && isTeam2) {
        scores[match.team1.name] += match.score[0] - match.score[1];
        scores[match.team2.name] += match.score[1] - match.score[0];
      }
    });

    if (scores[teamA.name] !== scores[teamB.name]) {
      return scores[teamB.name] - scores[teamA.name];
    }

    return 0;
  }
}
