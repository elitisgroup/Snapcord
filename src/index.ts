/*************************************************
 * Snapcord                                      *
 *                                               *
 * Copyright © 2020 Elitis. All rights reserved. *
 * Licensed under 3.0 of the APGL.               *
 *************************************************/

import { Client } from "eris";
import config from "./config";
import { readdirSync } from "fs";

export const client: Client = new Client(config.token);

readdirSync(`${__dirname}/events`)
  .filter((f: string): boolean => f.endsWith(".js"))
  .map((f: string): string => f.replace(".js", ""))
  .forEach(async (f: string): Promise<Client> => client.on(f, (await import(`${__dirname}/events/${f}`)).default));
  
client.connect();
