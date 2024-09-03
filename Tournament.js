import { Group } from "./Group.js";
import { KnockoutStage } from "./KnockoutStage.js";

export class Tournament {
  constructor(groupData) {
    this.groups = Object.entries(groupData).map(
      ([name, teams]) => new Group(name, teams)
    );
    this.rankedTeams = [];
    this.knockoutStage = null;
  }

  simulateGroupStage() {
    this.groups.forEach((group) => group.simulateMatches());
  }

  rankTeams() {
    const allTeams = this.groups.flatMap((group) => group.getStandings());
    this.rankedTeams = allTeams.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      const pointDiffA = a.scoredPoints - a.concededPoints;
      const pointDiffB = b.scoredPoints - b.concededPoints;
      if (pointDiffA !== pointDiffB) return pointDiffB - pointDiffA;
      return b.scoredPoints - a.scoredPoints;
    });
  }

  startKnockoutStage() {
    this.knockoutStage = new KnockoutStage(this.rankedTeams);
    this.knockoutStage.drawQuarterfinals();
    this.knockoutStage.simulateSemifinals();
    this.knockoutStage.simulateThirdPlaceMatch();
    this.knockoutStage.simulateFinal();
  }

  getResults() {
    return {
      groupStage: this.groups.map((group) => ({
        name: group.name,
        matches: group.matches,
        standings: group.getStandings(),
      })),
      rankedTeams: this.rankedTeams,
      knockoutStage: this.knockoutStage
        ? this.knockoutStage.getResults()
        : null,
    };
  }
}
