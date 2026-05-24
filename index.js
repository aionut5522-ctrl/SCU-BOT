const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CANAL_IC_ID = '1507862770597499077';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

function dataRo() {
    return new Date().toLocaleDateString('ro-RO');
}

// BUTOANE
function createButtons(type) {

    return new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId(`accept_${type}`)
            .setLabel('Aprobat')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId(`reject_${type}`)
            .setLabel('Respins')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger)

    );
}

// EMBED
function createEmbed(title, color, user) {

    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setThumbnail(user.displayAvatarURL({
            dynamic: true,
            size: 1024
        }));
}

// COMENZI
const commands = [

    // /me
    new SlashCommandBuilder()
        .setName('me')
        .setDescription('Actiune roleplay')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text')
                .setRequired(true)
        ),

    // /sanctiune
    new SlashCommandBuilder()
        .setName('sanctiune')
        .setDescription('Acorda o sanctiune')
        .addUserOption(option =>
            option.setName('persoana')
                .setDescription('Persoana sanctionata')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sanctiune')
                .setDescription('Tip sanctiune')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('amenda')
                .setDescription('Amenda')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('dovezi')
                .setDescription('Dovezi')
                .setRequired(false)
        ),

    // /demisie
    new SlashCommandBuilder()
        .setName('demisie')
        .setDescription('Cerere demisie')
        .addStringOption(option =>
            option.setName('nume')
                .setDescription('Nume IC')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('cnp')
                .setDescription('CNP')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('zile')
                .setDescription('Zile')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('rank')
                .setDescription('Rank')
                .setRequired(true)
        ),

    // /cerereinactivitate
    new SlashCommandBuilder()
        .setName('cerereinactivitate')
        .setDescription('Cerere inactivitate')
        .addStringOption(option =>
            option.setName('perioada')
                .setDescription('Perioada')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('zile')
                .setDescription('Numar zile')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('detalii')
                .setDescription('Alte detalii')
                .setRequired(false)
        ),

    // /invoiresedinta
    new SlashCommandBuilder()
        .setName('invoiresedinta')
        .setDescription('Cerere invoire sedinta')
        .addStringOption(option =>
            option.setName('data')
                .setDescription('Data sedintei')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        ),

    // /seif
    new SlashCommandBuilder()
        .setName('seif')
        .setDescription('Gestionare seif')
        .addStringOption(option =>
            option.setName('actiune')
                .setDescription('Actiune')
                .setRequired(true)
                .addChoices(
                    { name: 'Depunere', value: 'Depunere' },
                    { name: 'Retragere', value: 'Retragere' }
                )
        )
        .addStringOption(option =>
            option.setName('numeic')
                .setDescription('Nume IC')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('cnp')
                .setDescription('CNP')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('suma')
                .setDescription('Suma/materiale')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('dovada')
                .setDescription('Dovada')
                .setRequired(true)
        )

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

// READY
client.once('ready', async () => {

    console.log(`✅ Bot online: ${client.user.tag}`);

    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
    );

    console.log('✅ Slash commands loaded.');

});

// INTERACTIUNI
client.on('interactionCreate', async interaction => {

    // BUTOANE
    if (interaction.isButton()) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {

            return interaction.reply({
                content: '❌ Nu ai acces la aceasta actiune.',
                ephemeral: true
            });
        }

        const approved = interaction.customId.startsWith('accept_');

        const embed = EmbedBuilder.from(interaction.message.embeds[0]);

        embed.setTitle(
            approved
            ? `${embed.data.title.replace(' - IN ASTEPTARE', '')} - APROBAT ✅`
            : `${embed.data.title.replace(' - IN ASTEPTARE', '')} - RESPINS ❌`
        );

        embed.setDescription(
            approved
            ? `✅ Aprobat de: ${interaction.user}\n🗓️ Acceptata pe: ${dataRo()}`
            : `❌ Respins de: ${interaction.user}\n🗓️ Respinsa pe: ${dataRo()}`
        );

        embed.setColor(
            approved
            ? 0x57f287
            : 0xed4245
        );

        return interaction.update({
            embeds: [embed],
            components: []
        });
    }

    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    // /me
    if (interaction.commandName === 'me') {

        const text = interaction.options.getString('text');

        return interaction.editReply(
            `💬 ***${interaction.user.username}*** spune: ***${text}***`
        );
    }

    // /sanctiune
    if (interaction.commandName === 'sanctiune') {

        const persoana = interaction.options.getUser('persoana');
        const sanctiune = interaction.options.getString('sanctiune');
        const motiv = interaction.options.getString('motiv');
        const amenda = interaction.options.getString('amenda') || 'N/A';
        const dovezi = interaction.options.getString('dovezi') || 'N/A';

        const embed = createEmbed(
            '🔴 Sanctiune - IN ASTEPTARE',
            0xfee75c,
            persoana
        );

        embed.setDescription(
`📅 **Data:** ${dataRo()}
👤 **Persoana sanctionata:** ${persoana}
⚠️ **Sanctiune:** ${sanctiune}
💸 **Amenda:** ${amenda}
📋 **Motiv:** ${motiv}
📎 **Dovezi:** ${dovezi}`
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('sanctiune')]
        });
    }

    // /demisie
    if (interaction.commandName === 'demisie') {

        const embed = createEmbed(
            '📄 Cerere Demisie - IN ASTEPTARE',
            0xfee75c,
            interaction.user
        );

        embed.setDescription(
`👤 **Nume:** ${interaction.options.getString('nume')}
🪪 **CNP:** ${interaction.options.getString('cnp')}
📋 **Motiv:** ${interaction.options.getString('motiv')}
📅 **Zile:** ${interaction.options.getString('zile')}
🎖️ **Rank:** ${interaction.options.getString('rank')}`
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('demisie')]
        });
    }

    // /cerereinactivitate
    if (interaction.commandName === 'cerereinactivitate') {

        const embed = createEmbed(
            '🟡 Cerere Inactivitate - IN ASTEPTARE',
            0xfee75c,
            interaction.user
        );

        embed.setDescription(
`📆 **Perioada:** ${interaction.options.getString('perioada')}
🔢 **Numar zile:** ${interaction.options.getString('zile')}
📋 **Motiv:** ${interaction.options.getString('motiv')}
📌 **Alte detalii:** ${interaction.options.getString('detalii') || 'N/A'}`
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('inactivitate')]
        });
    }

    // /invoiresedinta
    if (interaction.commandName === 'invoiresedinta') {

        const embed = createEmbed(
            '🟡 Cerere Invoire Sedinta - IN ASTEPTARE',
            0xfee75c,
            interaction.user
        );

        embed.setDescription(
`👤 **Utilizator:** ${interaction.user}
📅 **Data sedintei:** ${interaction.options.getString('data')}
📋 **Motiv:** ${interaction.options.getString('motiv')}`
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('invoiresedinta')]
        });
    }

    // /seif
    if (interaction.commandName === 'seif') {

        const actiune = interaction.options.getString('actiune');

        const embed = createEmbed(
            `💰 ${actiune} Seif - IN ASTEPTARE`,
            0xfee75c,
            interaction.user
        );

        embed.setDescription(
`📦 **Actiune:** ${actiune}
👤 **Nume IC:** ${interaction.options.getString('numeic')}
🪪 **CNP:** ${interaction.options.getString('cnp')}
💵 **Suma/Materiale:** ${interaction.options.getString('suma')}
📎 **Dovada:** ${interaction.options.getString('dovada')}`
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('seif')]
        });
    }

});

// STERGERE MESAJE IC
client.on('messageCreate', async message => {

    if (message.author.bot) return;

    if (message.channel.id === CANAL_IC_ID) {

        try {
            await message.delete();
        } catch {
            console.log('Nu pot sterge mesajul.');
        }

    }

});

client.login(TOKEN);