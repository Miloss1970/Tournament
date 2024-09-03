import { Match } from "./Match.js";

export class KnockoutStage {
  constructor(rankedTeams) {
    this.rankedTeams = rankedTeams;
    this.quarterfinals = [];
    this.semifinals = [];
    this.thirdPlace = null;
    this.final = null;
  }

  drawQuarterfinals() {
    const pots = {
      D: this.rankedTeams.slice(0, 2),
      E: this.rankedTeams.slice(2, 4),
      F: this.rankedTeams.slice(4, 6),
      G: this.rankedTeams.slice(6, 8),
    };
    const usedTeams = new Set();
    const pairs = [
      { pot1: "D", pot2: "G" },
      { pot1: "E", pot2: "F" },
    ];

    while (this.quarterfinals.length < 4) {
      pairs.forEach(({ pot1, pot2 }) => {
        const team1 = this.getRandomTeam(pots[pot1], usedTeams, null);
        if (team1) {
          const team2 = this.getRandomTeam(
            pots[pot2],
            usedTeams,
            team1.groupName
          );
          if (team2) {
            this.quarterfinals.push(Match.simulateMatch(team1, team2));
            usedTeams.add(team1.name);
            usedTeams.add(team2.name);
          }
        }
      });
    }
  }

  getRandomTeam(pot, usedTeams, excludeGroup) {
    const availableTeams = pot.filter(
      (t) => !usedTeams.has(t.name) && t.groupName !== excludeGroup
    );
    return availableTeams.length > 0
      ? availableTeams[Math.floor(Math.random() * availableTeams.length)]
      : null;
  }

  simulateSemifinals() {
    this.semifinals.push(
      Match.simulateMatch(
        this.quarterfinals[0].team1,
        this.quarterfinals[1].team1
      )
    );
    this.semifinals.push(
      Match.simulateMatch(
        this.quarterfinals[2].team1,
        this.quarterfinals[3].team1
      )
    );
  }

  simulateThirdPlaceMatch() {
    this.thirdPlace = Match.simulateMatch(
      this.semifinals[0].team2,
      this.semifinals[1].team2
    );
  }

  simulateFinal() {
    this.final = Match.simulateMatch(
      this.semifinals[0].team1,
      this.semifinals[1].team1
    );
  }

  getResults() {
    return {
      quarterfinals: this.quarterfinals,
      semifinals: this.semifinals,
      thirdPlace: this.thirdPlace,
      final: this.final,
    };
  }
}
