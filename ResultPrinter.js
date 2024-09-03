export class ResultPrinter {
  printResults(results) {
    this.printGroupStage(results.groupStage);
    this.printRankedTeams(results.rankedTeams);
    this.printKnockoutStage(results.knockoutStage);
  }

  printGroupStage(groupStage) {
    console.log("Grupna faza - rezultati:");

    groupStage.forEach((group) => {
      console.log(`Grupa ${group.name}:`);

      const matchesByRound = group.matches.reduce((acc, match) => {
        acc[match.round] = acc[match.round] || [];

        acc[match.round].push(match);
        return acc;
      }, {});

      Object.entries(matchesByRound).forEach(([round, matches]) => {
        console.log(` Kolo ${round}:`);
        matches.forEach((match) => {
          console.log(
            `    ${match.team1.name} - ${match.team2.name} (${match.score[0]}:${match.score[1]})`
          );
        });
      });

      console.log(`Konačan plasman u grupi ${group.name}:
  (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika):`);
      group.standings.forEach((team) => {
        console.log(
          `    ${team.name.padEnd(20)} ${team.wins} / ${team.losses} / ${
            team.points
          } / ${team.scoredPoints} / ${team.concededPoints} / ${
            team.scoredPoints - team.concededPoints
          }`
        );
      });
    });
  }

  printRankedTeams(rankedTeams) {
    console.log("Šeširi:");
    const pots = {
      D: rankedTeams.slice(0, 2),
      E: rankedTeams.slice(2, 4),
      F: rankedTeams.slice(4, 6),
      G: rankedTeams.slice(6, 8),
    };
    Object.entries(pots).forEach(([potName, teams]) => {
      console.log(` Šešir ${potName}`);
      teams.forEach((team) => console.log(`  ${team.name}`));
    });
  }

  printKnockoutStage(knockoutStage) {
    console.log("Četvrtfinale:");
    knockoutStage.quarterfinals.forEach((match) => {
      console.log(
        `  ${match.team1.name} - ${match.team2.name} (${match.score[0]}:${match.score[1]})`
      );
    });

    console.log("Polufinale:");
    knockoutStage.semifinals.forEach((match) => {
      console.log(
        `  ${match.team1.name} - ${match.team2.name} (${match.score[0]}:${match.score[1]})`
      );
    });

    console.log("Utakmica za treće mesto:");
    console.log(
      `  ${knockoutStage.thirdPlace.team1.name} - ${knockoutStage.thirdPlace.team2.name} (${knockoutStage.thirdPlace.score[0]}:${knockoutStage.thirdPlace.score[1]})`
    );

    console.log("Finale:");
    console.log(
      `  ${knockoutStage.final.team1.name} - ${knockoutStage.final.team2.name} (${knockoutStage.final.score[0]}:${knockoutStage.final.score[1]})`
    );

    console.log("Medalje:");
    console.log(`  1. ${knockoutStage.final.team1.name}`);
    console.log(`  2. ${knockoutStage.final.team2.name}`);
    console.log(`  3. ${knockoutStage.thirdPlace.team1.name}`);
  }
}
