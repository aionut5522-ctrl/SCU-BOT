const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes
} = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// ID CHAT IC
const canalPermis = '1507862770597499077';

// SLASH COMMANDS
const commands = [

    // /me
    new SlashCommandBuilder()
        .setName('me')
        .setDescription('Actiune RP')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Ce vrei sa spui')
                .setRequired(true)
        ),

    // /fw
    new SlashCommandBuilder()
        .setName('fw')
        .setDescription('Acorda FW')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Utilizator')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        ),

    // /cerereinactivitate
    new SlashCommandBuilder()
        .setName('cerereinactivitate')
        .setDescription('Trimite o cerere de inactivitate')
        .addStringOption(option =>
            option
                .setName('zile')
                .setDescription('Numar de zile')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        )

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// BOT READY
client.once('ready', async () => {

    console.log(`✅ Bot online: ${client.user.tag}`);

    try {

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        console.log('✅ Slash commands loaded.');

    } catch (error) {
        console.error(error);
    }

});

// SLASH COMMANDS
client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    // /me
    if (interaction.commandName === 'me') {

        const text = interaction.options.getString('text');

        await interaction.reply(
            `💬 ***${interaction.user.username}*** spune: ***${text}***`
        );
    }

    // /fw
    if (interaction.commandName === 'fw') {

        const user = interaction.options.getUser('user');
        const motiv = interaction.options.getString('motiv');

        await interaction.reply(
            `⚠️ **FW acordat lui ${user}**\n📋 **Motiv:** ${motiv}\n👮 **Acordat de:** ${interaction.user}`
        );
    }

    // /cerereinactivitate
    if (interaction.commandName === 'cerereinactivitate') {

        const zile = interaction.options.getString('zile');
        const motiv = interaction.options.getString('motiv');

        await interaction.reply(
            `📌 **Cerere de inactivitate**\n👤 **Membru:** ${interaction.user}\n📅 **Zile:** ${zile}\n📋 **Motiv:** ${motiv}`
        );
    }

});

// STERGE MESAJELE NORMALE DIN CHAT IC
client.on('messageCreate', async message => {

    if (message.author.bot) return;

    // doar in canalul setat
    if (message.channel.id === canalPermis) {

        // daca NU incepe cu /
        if (!message.content.startsWith('/')) {

            try {
                await message.delete();
            } catch (err) {
                console.log('Nu pot sterge mesajul.');
            }

        }

    }

});

client.login(process.env.TOKEN);