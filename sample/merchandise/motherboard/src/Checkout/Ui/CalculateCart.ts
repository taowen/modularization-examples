import { Command } from "@autonomy-design-sample/entity-archetype";

export class CalculateCart extends Command {
  public run() {
    return "hello";
  }
}

export const calculateCart = Command.of(CalculateCart);
