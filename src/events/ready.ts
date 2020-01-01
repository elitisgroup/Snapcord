import { client } from "..";

export default (): void => console.log(`Client ready as ${client.user.username}.`);