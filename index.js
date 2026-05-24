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
const GUILD_ID = '1507862769741860925';
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

function createEmbed(title, color, user) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setFooter({ text: `O' Jastemma • ${user.username}` });
}

const commands = [
    new SlashCommandBuilder()
        .setName('me')
        .setDescription('Actiune roleplay')
        .addStringOption(o => o.setName('text').setDescription('Text').setRequired(true)),

    new SlashCommandBuilder()
        .setName('sanctiune')
        .setDescription('Acorda o sanctiune')
        .addUserOption(o => o.setName('persoana').setDescription('Persoana sanctionata').setRequired(true))
        .addStringOption(o => o.setName('sanctiune').setDescription('Tip sanctiune').setRequired(true))
        .addStringOption(o => o.setName('motiv').setDescription('Motiv').setRequired(true))
        .addStringOption(o => o.setName('amenda').setDescription('Amenda').setRequired(false))
        .addStringOption(o => o.setName('dovezi').setDescription('Dovezi').setRequired(false)),

    new SlashCommandBuilder()
        .setName('demisie')
        .setDescription('Cerere demisie')
        .addStringOption(o => o.setName('nume').setDescription('Nume IC').setRequired(true))
        .addStringOption(o => o.setName('cnp').setDescription('CNP').setRequired(true))
        .addStringOption(o => o.setName('motiv').setDescription('Motiv').setRequired(true))
        .addStringOption(o => o.setName('zile').setDescription('Zile').setRequired(true))
        .addStringOption(o => o.setName('rank').setDescription('Rank').setRequired(true)),

    new SlashCommandBuilder()
        .setName('cerereinactivitate')
        .setDescription('Cerere inactivitate')
        .addStringOption(o => o.setName('perioada').setDescription('Perioada').setRequired(true))
        .addStringOption(o => o.setName('zile').setDescription('Numar zile').setRequired(true))
        .addStringOption(o => o.setName('motiv').setDescription('Motiv').setRequired(true))
        .addStringOption(o => o.setName('detalii').setDescription('Alte detalii').setRequired(false)),

    new SlashCommandBuilder()
        .setName('invoiresedinta')
        .setDescription('Cerere invoire sedinta')
        .addStringOption(o => o.setName('data').setDescription('Data sedintei').setRequired(true))
        .addStringOption(o => o.setName('motiv').setDescription('Motiv').setRequired(true)),

    new SlashCommandBuilder()
        .setName('seif')
        .setDescription('Gestionare seif')
        .addStringOption(o =>
            o.setName('actiune')
                .setDescription('Actiune')
                .setRequired(true)
                .addChoices(
                    { name: 'Depunere', value: 'Depunere' },
                    { name: 'Retragere', value: 'Retragere' }
                )
        )
        .addStringOption(o => o.setName('numeic').setDescription('Nume IC').setRequired(true))
        .addStringOption(o => o.setName('cnp').setDescription('CNP').setRequired(true))
        .addStringOption(o => o.setName('suma').setDescription('Suma/materiale').setRequired(true))
        .addStringOption(o => o.setName('dovada').setDescription('Dovada').setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`✅ Bot online: ${client.user.tag}`);

    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: [] });

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash commands loaded.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isButton()) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({
                    content: '❌ Nu ai acces la aceasta actiune.',
                    ephemeral: true
                });
            }

            const approved = interaction.customId.startsWith('accept_');
            const embed = EmbedBuilder.from(interaction.message.embeds[0]);
            const oldDescription = embed.data.description || '';

            embed.setTitle(
                approved
                    ? `${embed.data.title.replace(' - IN ASTEPTARE', '')} - APROBAT ✅`
                    : `${embed.data.title.replace(' - IN ASTEPTARE', '')} - RESPINS ❌`
            );

            embed.setDescription(
`${oldDescription}

${approved ? '✅' : '❌'} **${approved ? 'Aprobat' : 'Respins'} de:** ${interaction.user.username}
🗓️ **${approved ? 'Acceptata' : 'Respinsa'} pe:** ${dataRo()}`
            );

            embed.setColor(approved ? 0x57f287 : 0xed4245);

            return interaction.update({
                embeds: [embed],
                components: []
            });
        }

        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply();

        if (interaction.commandName === 'me') {
            const text = interaction.options.getString('text');
            return interaction.editReply(`💬 ***${interaction.user.username}*** spune: ***${text}***`);
        }

        if (interaction.commandName === 'sanctiune') {
            const persoana = interaction.options.getUser('persoana');
            const sanctiune = interaction.options.getString('sanctiune');
            const motiv = interaction.options.getString('motiv');
            const amenda = interaction.options.getString('amenda') || 'N/A';
            const dovezi = interaction.options.getString('dovezi') || 'N/A';

            const embed = createEmbed('🔴 Sanctiune - IN ASTEPTARE', 0xfee75c, persoana)
                .setDescription(
`📅 **Data:** ${dataRo()}
👤 **Persoana sanctionata:** ${persoana}
⚠️ **Sanctiune:** ${sanctiune}
💸 **Amenda:** ${amenda}
📋 **Motiv:** ${motiv}
📎 **Dovezi:** ${dovezi}`
                );

            return interaction.editReply({ embeds: [embed], components: [createButtons('sanctiune')] });
        }

        if (interaction.commandName === 'demisie') {
            const embed = createEmbed('📄 Cerere Demisie - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`👤 **Nume:** ${interaction.options.getString('nume')}
🪪 **CNP:** ${interaction.options.getString('cnp')}
📋 **Motiv:** ${interaction.options.getString('motiv')}
📅 **Zile:** ${interaction.options.getString('zile')}
🎖️ **Rank:** ${interaction.options.getString('rank')}`
                );

            return interaction.editReply({ embeds: [embed], components: [createButtons('demisie')] });
        }

        if (interaction.commandName === 'cerereinactivitate') {
            const embed = createEmbed('🟡 Cerere Inactivitate - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`📆 **Perioada:** ${interaction.options.getString('perioada')}
🔢 **Numar zile:** ${interaction.options.getString('zile')}
📋 **Motiv:** ${interaction.options.getString('motiv')}
📌 **Alte detalii:** ${interaction.options.getString('detalii') || 'N/A'}`
                );

            return interaction.editReply({ embeds: [embed], components: [createButtons('inactivitate')] });
        }

        if (interaction.commandName === 'invoiresedinta') {
            const embed = createEmbed('🟡 Cerere Invoire Sedinta - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`👤 **Utilizator:** ${interaction.user}
📅 **Data sedintei:** ${interaction.options.getString('data')}
📋 **Motiv:** ${interaction.options.getString('motiv')}`
                );

            return interaction.editReply({ embeds: [embed], components: [createButtons('invoiresedinta')] });
        }

        if (interaction.commandName === 'seif') {
            const actiune = interaction.options.getString('actiune');

            const embed = createEmbed(`💰 ${actiune} Seif - IN ASTEPTARE`, 0xfee75c, interaction.user)
                .setDescription(
`📦 **Actiune:** ${actiune}
👤 **Nume IC:** ${interaction.options.getString('numeic')}
🪪 **CNP:** ${interaction.options.getString('cnp')}
💵 **Suma/Materiale:** ${interaction.options.getString('suma')}
📎 **Dovada:** ${interaction.options.getString('dovada')}`
                );

            return interaction.editReply({ embeds: [embed], components: [createButtons('seif')] });
        }

    } catch (error) {
        if (error.code === 10062) {
            console.log('Interactiune expirata/ignorata.');
            return;
        }

        console.error(error);
    }
});

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

client.on('error', console.error);

process.on('unhandledRejection', error => {
    if (error.code === 10062) return;
    console.error(error);
});

client.login(TOKEN);