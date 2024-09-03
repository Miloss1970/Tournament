export class Match {
  constructor(team1, team2, score) {
    this.team1 = team1;
    this.team2 = team2;
    this.score = score;
  }

  static calculateBaseScore(team1, team2) {
    let baseScore1 = 70;
    let baseScore2 = 70;

    if (
      team1.getAverageForm() > team2.getAverageForm() &&
      team1.fibaRanking < team2.fibaRanking
    ) {
      baseScore1 += 10;
    } else if (
      team2.getAverageForm() > team1.getAverageForm() &&
      team2.fibaRanking < team1.fibaRanking
    ) {
      baseScore2 += 10;
    } else {
      if (
        team1.getAverageForm() > team2.getAverageForm() ||
        team1.fibaRanking < team2.fibaRanking
      ) {
        baseScore1 += 5;
      }
      if (
        team2.getAverageForm() > team1.getAverageForm() ||
        team2.fibaRanking < team1.fibaRanking
      ) {
        baseScore2 += 5;
      }
    }

    return [baseScore1, baseScore2];
  }

  static generateRandomScore(baseScore) {
    return Math.floor(Math.random() * 15) + baseScore;
  }

  static simulateMatch(team1, team2) {
    const [baseScore1, baseScore2] = this.calculateBaseScore(team1, team2);

    const score1 = this.generateRandomScore(baseScore1);
    const score2 = this.generateRandomScore(baseScore2);

    if (score1 == score2) return this.simulateMatch(team1, team2);

    if (score1 > score2) {
      return new Match(team1, team2, [score1, score2]);
    } else {
      return new Match(team2, team1, [score2, score1]);
    }
  }

  updateTeamStats() {
    this.team1.updateStats(
      this.score[0] > this.score[1],
      this.score[0],
      this.score[1],
      this.team2
    );
    this.team2.updateStats(
      this.score[1] > this.score[0],
      this.score[1],
      this.score[0],
      this.team1
    );
  }
}
