import { writeFileSync } from "fs";
import { join } from "path";

export const saveToFile = (fileName: string, data: string) => {
  writeFileSync(join(__dirname, "..", "output", fileName), data, "utf-8");
};
