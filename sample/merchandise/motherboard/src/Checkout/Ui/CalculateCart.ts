import { Command } from "@autonomy/entity-archetype";

export class CalculateCart extends Command {
  public run() {
    return "hello";
  }
}

export const calculateCart = Command.toRun(CalculateCart);