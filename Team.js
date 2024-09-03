import exibitions from "./exibitions.json" assert { type: "json" };

export class Team {
  constructor(name, isoCode, fibaRanking, groupName) {
    this.name = name;
    this.isoCode = isoCode;
    this.fibaRanking = fibaRanking;
    this.groupName = groupName;
    this.wins = 0;
    this.losses = 0;
    this.points = 0;
    this.scoredPoints = 0;
    this.concededPoints = 0;
    this.matchHistory = [];
    this.exhibitionData = exibitions[isoCode] || [];

    this.updateInitialForm();
  }

  updateInitialForm() {
    this.exhibitionData.forEach((match) => {
      const [teamScore, opponentScore] = match.Result.split("-").map(Number);
      const isWinner = teamScore > opponentScore;
      const formChange = isWinner ? 0.5 : -0.5;

      this.matchHistory.push({
        opponent: match.Opponent,
        scoreDifference: teamScore - opponentScore,
        formChange,
      });
    });
  }

  updateStats(isWinner, scoredPoints, concededPoints, opponent) {
    this.updateScore(isWinner, scoredPoints, concededPoints);
    this.updateMatchHistory(isWinner, scoredPoints, concededPoints, opponent);
  }

  updateScore(isWinner, scoredPoints, concededPoints) {
    if (isWinner) {
      this.wins++;
      this.points += 2;
    } else {
      this.losses++;
      this.points += 1;
    }
    this.scoredPoints += scoredPoints;
    this.concededPoints += concededPoints;
  }

  updateMatchHistory(isWinner, scoredPoints, concededPoints, opponent) {
    const scoreDifference = scoredPoints - concededPoints;
    const formChange = isWinner ? 0.5 : -0.5;

    this.matchHistory.push({
      opponent: opponent.name,
      scoreDifference,
      formChange,
    });
  }

  getAverageForm() {
    const recentMatches = this.matchHistory.slice(-5);
    if (recentMatches.length === 0) return 0;

    return (
      recentMatches.reduce((sum, match) => sum + match.formChange, 0) /
      recentMatches.length
    );
  }
}
