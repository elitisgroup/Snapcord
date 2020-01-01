import { Message, User } from "eris";
import { client } from "..";
import * as request from "request";

export default async function(msg: Message) {
  if (msg.channel.type !== 1 || msg.author.bot) return;

  const [cmd, ...args]: string[] = msg.content.split(" ");

  if (cmd.startsWith("s")) {
    const timeout: number = parseInt(args.shift());
    const user: User = client.users.find((f: User): boolean => f.username + "#" + f.discriminator === args.join(" "));
    if (!user || !msg.attachments[0])
      return msg.channel.createMessage(
        "Usage: `snap <time before deletion> <user tag without the @>`. (Image must be attached.)"
      );

    request.defaults({ encoding: null }).get(msg.attachments[0].url, async (err, _res, body: Buffer) => {
      if (err)
        return msg.channel.createMessage(`Uhh, an exception was thrown when sending that Snap.\n\n\`\`\`${err}\`\`\``);
      msg.channel.createMessage(`Okidoke! I'm sending that to **<@${user.id}>**.`);

      const message: Message = await (await user.getDMChannel()).createMessage(
        `You received a Snap from **${msg.author.username}**!`,
        {
          name: msg.attachments[0].filename,
          file: body
        }
      );

      return setTimeout(
        (): Promise<Message> =>
          message
            .delete()
            .then(() =>
              message.channel.createMessage(
                `${message.content.slice(0, message.content.length - 1)}, but it timed out.`
              )
            ),
        timeout * 1000
      );
    });
  } else return msg.channel.createMessage("To send a snap to someone, just type `snap`.");
}
