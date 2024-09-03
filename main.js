import groups from "./groups.json" assert { type: "json" };
import { Tournament } from "./Tournament.js";
import { ResultPrinter } from "./ResultPrinter.js";

export class OlympicBasketballSimulation {
  constructor() {
    this.tournament = new Tournament(groups);
    this.resultPrinter = new ResultPrinter();
  }

  startTournament() {
    console.log("Simulacija Olimpijskog košarkaškog turnira");

    this.tournament.simulateGroupStage();
    this.tournament.rankTeams();

    this.tournament.startKnockoutStage();

    const results = this.tournament.getResults();
    this.resultPrinter.printResults(results);
  }
}

const simulation = new OlympicBasketballSimulation();
simulation.startTournament();
