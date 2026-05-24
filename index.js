const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
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

// CANAL IC unde se sterg mesajele normale
const CANAL_IC_ID = '1507862770597499077';

// ROL conducere care poate aproba/respinge
const ROLE_CONDUCERE_ID = '1507869789215789076';

const commands = [
    new SlashCommandBuilder()
        .setName('me')
        .setDescription('Actiune RP')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Textul actiunii')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('sanctiune')
        .setDescription('Emite o sanctiune')
        .addUserOption(option =>
            option.setName('persoana')
                .setDescription('Persoana sanctionata')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sanctiune')
                .setDescription('Sanctiunea acordata')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motivul sanctiunii')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('amenda')
                .setDescription('Amenda optionala')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('dovezi')
                .setDescription('Dovezi optional')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('demisie')
        .setDescription('Depune o cerere de demisie')
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
                .setDescription('Motivul demisiei')
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

    new SlashCommandBuilder()
        .setName('cerereinactivitate')
        .setDescription('Depune o cerere de inactivitate')
        .addStringOption(option =>
            option.setName('perioada')
                .setDescription('Ex: 17.05.2026 - 24.05.2026')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('zile')
                .setDescription('Numar de zile')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('detalii')
                .setDescription('Alte detalii optional')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('depunereseif')
        .setDescription('Depunere in seif')
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
                .setDescription('Suma de bani/materiale')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('dovada')
                .setDescription('Dovada foto/link')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('retragereseif')
        .setDescription('Retragere/adaugare din seif')
        .addStringOption(option =>
            option.setName('actiune')
                .setDescription('Ce s-a facut in seif')
                .setRequired(true)
                .addChoices(
                    { name: 'Retragere / scos', value: 'Retragere / scos' },
                    { name: 'Adaugare / pus', value: 'Adaugare / pus' }
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
                .setDescription('Suma de bani/materiale')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('dovada')
                .setDescription('Dovada foto/link')
                .setRequired(true)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

function dataRo() {
    return new Date().toLocaleDateString('ro-RO');
}

function buttons(type) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`approve_${type}`)
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

function baseEmbed(title, color, user) {
    return new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setFooter({ text: `Emis de ${user.tag}` })
        .setTimestamp();
}

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

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const member = interaction.member;

        if (!member.roles.cache.has(ROLE_CONDUCERE_ID)) {
            return interaction.reply({
                content: '❌ Nu ai permisiunea sa aprobi/respingi aceasta cerere.',
                ephemeral: true
            });
        }

        const isApproved = interaction.customId.startsWith('approve_');
        const oldEmbed = interaction.message.embeds[0];

        const embed = EmbedBuilder.from(oldEmbed)
            .setColor(isApproved ? 0x2ecc71 : 0xe74c3c)
            .setTitle(
                oldEmbed.title
                    .replace('IN ASTEPTARE', isApproved ? 'APROBAT ✅' : 'RESPINS ❌')
                    .replace('Asteptare', isApproved ? 'Aprobat ✅' : 'Respins ❌')
            )
            .addFields({
                name: isApproved ? '✅ Aprobat de' : '❌ Respins de',
                value: `${interaction.user}`,
                inline: true
            });

        return interaction.update({
            embeds: [embed],
            components: []
        });
    }

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'me') {
        const text = interaction.options.getString('text');
        return interaction.reply(`💬 ***${interaction.user.username}*** spune: ***${text}***`);
    }

    if (interaction.commandName === 'sanctiune') {
        const persoana = interaction.options.getUser('persoana');
        const sanctiune = interaction.options.getString('sanctiune');
        const motiv = interaction.options.getString('motiv');
        const amenda = interaction.options.getString('amenda') || 'N/A';
        const dovezi = interaction.options.getString('dovezi') || 'N/A';

        const embed = baseEmbed('🔴 Sanctiune - IN ASTEPTARE', 0xf1c40f, persoana)
            .addFields(
                { name: '📅 Data', value: dataRo(), inline: false },
                { name: '👤 Persoana sanctionata', value: `${persoana}`, inline: false },
                { name: '⚠️ Sanctiune', value: sanctiune, inline: false },
                { name: '💸 Amenda', value: amenda, inline: false },
                { name: '📋 Motiv', value: motiv, inline: false },
                { name: '📎 Dovezi', value: dovezi, inline: false }
            );

        return interaction.reply({ embeds: [embed], components: [buttons('sanctiune')] });
    }

    if (interaction.commandName === 'demisie') {
        const nume = interaction.options.getString('nume');
        const cnp = interaction.options.getString('cnp');
        const motiv = interaction.options.getString('motiv');
        const zile = interaction.options.getString('zile');
        const rank = interaction.options.getString('rank');

        const embed = baseEmbed('🔵 Cerere Demisie - IN ASTEPTARE', 0xf1c40f, interaction.user)
            .addFields(
                { name: '👤 Nume', value: nume, inline: false },
                { name: '🪪 CNP', value: cnp, inline: false },
                { name: '📋 Motivul demisiei', value: motiv, inline: false },
                { name: '📅 Zile', value: zile, inline: false },
                { name: '🎖️ Rank', value: rank, inline: false }
            );

        return interaction.reply({ embeds: [embed], components: [buttons('demisie')] });
    }

    if (interaction.commandName === 'cerereinactivitate') {
        const perioada = interaction.options.getString('perioada');
        const zile = interaction.options.getString('zile');
        const motiv = interaction.options.getString('motiv');
        const detalii = interaction.options.getString('detalii') || 'N/A';

        const embed = baseEmbed('🟡 Cerere de Inactivitate - IN ASTEPTARE', 0xf1c40f, interaction.user)
            .addFields(
                { name: '👤 Utilizator', value: `${interaction.user}`, inline: false },
                { name: '📆 Perioada', value: perioada, inline: false },
                { name: '🔢 Numar de zile', value: zile, inline: false },
                { name: '✏️ Motiv', value: motiv, inline: false },
                { name: '📌 Alte detalii', value: detalii, inline: false }
            );

        return interaction.reply({ embeds: [embed], components: [buttons('inactivitate')] });
    }

    if (interaction.commandName === 'depunereseif') {
        const numeic = interaction.options.getString('numeic');
        const cnp = interaction.options.getString('cnp');
        const suma = interaction.options.getString('suma');
        const dovada = interaction.options.getString('dovada');

        const embed = baseEmbed('🟢 Depunere Seif - IN ASTEPTARE', 0xf1c40f, interaction.user)
            .addFields(
                { name: '👤 Nume IC', value: numeic, inline: false },
                { name: '🪪 CNP', value: cnp, inline: false },
                { name: '💰 Suma de bani/materiale', value: suma, inline: false },
                { name: '📷 Dovada foto', value: dovada, inline: false }
            );

        return interaction.reply({ embeds: [embed], components: [buttons('depunereseif')] });
    }

    if (interaction.commandName === 'retragereseif') {
        const actiune = interaction.options.getString('actiune');
        const numeic = interaction.options.getString('numeic');
        const cnp = interaction.options.getString('cnp');
        const suma = interaction.options.getString('suma');
        const dovada = interaction.options.getString('dovada');

        const embed = baseEmbed('🟠 Retragere/Adaugare Seif - IN ASTEPTARE', 0xf1c40f, interaction.user)
            .addFields(
                { name: '📦 Actiune', value: actiune, inline: false },
                { name: '👤 Nume IC', value: numeic, inline: false },
                { name: '🪪 CNP', value: cnp, inline: false },
                { name: '💰 Suma de bani/materiale', value: suma, inline: false },
                { name: '📷 Dovada foto', value: dovada, inline: false }
            );

        return interaction.reply({ embeds: [embed], components: [buttons('retragereseif')] });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.channel.id === CANAL_IC_ID) {
        try {
            await message.delete();
        } catch (err) {
            console.log('Nu pot sterge mesajul din canalul IC.');
        }
    }
});

client.login(TOKEN);