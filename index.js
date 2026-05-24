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

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;

// ID CANAL IC
const CANAL_IC_ID = '1507862770597499077';

// LINK LOGO SCU
const LOGO_SCU = 'https://i.imgur.com/V5sP8LQ.png';

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
                .setDescription('Amenda optional')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('dovezi')
                .setDescription('Link dovezi')
                .setRequired(false)
        ),

    // /demisie
    new SlashCommandBuilder()
        .setName('demisie')
        .setDescription('Cerere demisie')
        .addStringOption(option =>
            option.setName('nume')
                .setDescription('Nume')
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

    // /seif
    new SlashCommandBuilder()
        .setName('seif')
        .setDescription('Gestionare seif')
        .addStringOption(option =>
            option.setName('actiune')
                .setDescription('Tip actiune')
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
                .setDescription('Link dovada')
                .setRequired(true)
        )

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

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

// EMBED PREMIUM
function createEmbed(title, user) {

    return new EmbedBuilder()
        .setColor(0xd4af37)
        .setTitle(title)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setImage(LOGO_SCU)
        .setFooter({
            text: `Sacra Corona Unita • ${user.tag}`
        })
        .setTimestamp();
}

// READY
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

        embed
            .setColor(approved ? 0x2ecc71 : 0xe74c3c)
            .setTitle(
                embed.data.title.replace(
                    'IN ASTEPTARE',
                    approved ? 'APROBAT ✅' : 'RESPINS ❌'
                )
            );

        embed.addFields({
            name: approved ? '✅ Aprobat de' : '❌ Respins de',
            value: `${interaction.user}`,
            inline: false
        });

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
            '🚨 Sanctiune - IN ASTEPTARE',
            persoana
        );

        embed.addFields(
            { name: '📅 Data', value: new Date().toLocaleDateString('ro-RO') },
            { name: '👤 Persoana sanctionata', value: `${persoana}` },
            { name: '⚠️ Sanctiune', value: sanctiune },
            { name: '💸 Amenda', value: amenda },
            { name: '📋 Motiv', value: motiv },
            { name: '📎 Dovezi', value: dovezi }
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('sanctiune')]
        });
    }

    // /demisie
    if (interaction.commandName === 'demisie') {

        const nume = interaction.options.getString('nume');
        const cnp = interaction.options.getString('cnp');
        const motiv = interaction.options.getString('motiv');
        const zile = interaction.options.getString('zile');
        const rank = interaction.options.getString('rank');

        const embed = createEmbed(
            '📄 Cerere Demisie - IN ASTEPTARE',
            interaction.user
        );

        embed.addFields(
            { name: '👤 Nume', value: nume },
            { name: '🪪 CNP', value: cnp },
            { name: '📋 Motivul demisiei', value: motiv },
            { name: '📅 Zile', value: zile },
            { name: '🎖️ Rank', value: rank }
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('demisie')]
        });
    }

    // /cerereinactivitate
    if (interaction.commandName === 'cerereinactivitate') {

        const perioada = interaction.options.getString('perioada');
        const zile = interaction.options.getString('zile');
        const motiv = interaction.options.getString('motiv');
        const detalii = interaction.options.getString('detalii') || 'N/A';

        const embed = createEmbed(
            '🟡 Cerere Inactivitate - IN ASTEPTARE',
            interaction.user
        );

        embed.addFields(
            { name: '📆 Perioada', value: perioada },
            { name: '🔢 Numar zile', value: zile },
            { name: '📋 Motiv', value: motiv },
            { name: '📌 Alte detalii', value: detalii }
        );

        return interaction.editReply({
            embeds: [embed],
            components: [createButtons('inactivitate')]
        });
    }

    // /seif
    if (interaction.commandName === 'seif') {

        const actiune = interaction.options.getString('actiune');
        const numeic = interaction.options.getString('numeic');
        const cnp = interaction.options.getString('cnp');
        const suma = interaction.options.getString('suma');
        const dovada = interaction.options.getString('dovada');

        const embed = createEmbed(
            `💰 ${actiune} Seif - IN ASTEPTARE`,
            interaction.user
        );

        embed.addFields(
            { name: '📦 Actiune', value: actiune },
            { name: '👤 Nume IC', value: numeic },
            { name: '🪪 CNP', value: cnp },
            { name: '💵 Suma/Materiale', value: suma },
            { name: '📎 Dovada', value: dovada }
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

        } catch (err) {

            console.log('Nu pot sterge mesajul.');

        }

    }

});

client.login(TOKEN);