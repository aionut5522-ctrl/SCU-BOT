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

// CANALE
const CHAT_IC_ID = '1507862770597499077';
const CERERE_DEMISIE_ID = '1508084743475036190';
const CERERE_INACTIVITATE_ID = '1508084395859378257';
const SANCTIUNI_ID = '1508084567226192072';
const SEIF_ID = '1508088992002740255';
const ANUNTURI_IC_ID = '1508083928500666419';

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

function dataOraRo() {
    return new Date().toLocaleString('ro-RO');
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
        .addStringOption(o => o.setName('detalii').setDescription('Detalii').setRequired(false)),

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
        .addStringOption(o => o.setName('dovada').setDescription('Dovada').setRequired(true)),

    new SlashCommandBuilder()
        .setName('anunt')
        .setDescription('Anunt IC')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o => o.setName('text').setDescription('Text anunt').setRequired(true)),

    new SlashCommandBuilder()
        .setName('actiune')
        .setDescription("Creeaza o actiune O'Jastemma")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o => o.setName('locatie').setDescription('Locatia actiunii').setRequired(true))
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
            if (interaction.customId.startsWith('actiune_')) {
                const embed = EmbedBuilder.from(interaction.message.embeds[0]);
                let desc = embed.data.description || '';

                const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
                const mentions = [...desc.matchAll(/<@!?(\d+)>/g)].map(m => m[1]);
                let participants = [...new Set(mentions)];

                const prezentaOprita = desc.includes('⛔ **Prezenta:** OPRITA');
                const actiuneInchisa = desc.includes('🔒 **Status:** INCHISA');

                if (interaction.customId === 'actiune_particip') {
                    if (prezentaOprita || actiuneInchisa) {
                        return interaction.reply({ content: '❌ Prezenta este oprita.', ephemeral: true });
                    }

                    if (!participants.includes(interaction.user.id)) {
                        participants.push(interaction.user.id);
                    }
                }

                if (interaction.customId === 'actiune_nu_particip') {
                    if (prezentaOprita || actiuneInchisa) {
                        return interaction.reply({ content: '❌ Prezenta este oprita.', ephemeral: true });
                    }

                    participants = participants.filter(id => id !== interaction.user.id);
                }

                if (interaction.customId === 'actiune_stop_prezenta') {
                    if (!isAdmin) {
                        return interaction.reply({ content: '❌ Doar administratorii pot opri prezenta.', ephemeral: true });
                    }

                    desc = desc.replace('🟢 **Prezenta:** DESCHISA', '⛔ **Prezenta:** OPRITA');
                }

                if (interaction.customId === 'actiune_inchide') {
                    if (!isAdmin) {
                        return interaction.reply({ content: '❌ Doar administratorii pot inchide actiunea.', ephemeral: true });
                    }

                    desc = desc.replace('🟢 **Prezenta:** DESCHISA', '⛔ **Prezenta:** OPRITA');
                    desc = desc.replace('🟡 **Status:** IN DESFASURARE', '🔒 **Status:** INCHISA');
                    desc += `\n🔒 **Inchisa la:** ${dataOraRo()}`;

                    embed.setTitle("--------------- ● ACTIUNE O'JASTEMMA - INCHISA ● ---------------");
                    embed.setColor(0xed4245);

                    const lista = participants.length ? participants.map(id => `<@${id}>`).join(', ') : 'N/A';

                    desc = desc.replace(/👥 \*\*Total participanti:\*\* .*/g, `👥 **Total participanti:** ${participants.length}`);
                    desc = desc.replace(/📋 \*\*Participanti:\*\* .*/g, `📋 **Participanti:** ${lista}`);

                    embed.setDescription(desc);

                    return interaction.update({
                        embeds: [embed],
                        components: []
                    });
                }

                const lista = participants.length ? participants.map(id => `<@${id}>`).join(', ') : 'N/A';

                desc = desc.replace(/👥 \*\*Total participanti:\*\* .*/g, `👥 **Total participanti:** ${participants.length}`);
                desc = desc.replace(/📋 \*\*Participanti:\*\* .*/g, `📋 **Participanti:** ${lista}`);

                embed.setDescription(desc);

                return interaction.update({ embeds: [embed] });
            }

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
            if (interaction.channel.id !== CHAT_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #chat-ic');
            }

            const text = interaction.options.getString('text');
            return interaction.editReply(`💬 ***${interaction.user.username}*** spune: ***${text}***`);
        }

        if (interaction.commandName === 'sanctiune') {
            if (interaction.channel.id !== SANCTIUNI_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #sanctiuni');
            }

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

            return interaction.editReply({
                embeds: [embed],
                components: [createButtons('sanctiune')]
            });
        }

        if (interaction.commandName === 'demisie') {
            if (interaction.channel.id !== CERERE_DEMISIE_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #cerere-demisie');
            }

            const embed = createEmbed('📄 Cerere Demisie - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
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

        if (interaction.commandName === 'cerereinactivitate') {
            if (interaction.channel.id !== CERERE_INACTIVITATE_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #cerere-inactivitate');
            }

            const embed = createEmbed('🟡 Cerere Inactivitate - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`📆 **Perioada:** ${interaction.options.getString('perioada')}
🔢 **Numar zile:** ${interaction.options.getString('zile')}
📋 **Motiv:** ${interaction.options.getString('motiv')}
📌 **Detalii:** ${interaction.options.getString('detalii') || 'N/A'}`
                );

            return interaction.editReply({
                embeds: [embed],
                components: [createButtons('inactivitate')]
            });
        }

        if (interaction.commandName === 'invoiresedinta') {
            if (interaction.channel.id !== CERERE_INACTIVITATE_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #cerere-inactivitate');
            }

            const embed = createEmbed('🟡 Cerere Invoire Sedinta - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`👤 **Utilizator:** ${interaction.user}
📅 **Data sedintei:** ${interaction.options.getString('data')}
📋 **Motiv:** ${interaction.options.getString('motiv')}`
                );

            return interaction.editReply({
                embeds: [embed],
                components: [createButtons('invoiresedinta')]
            });
        }

        if (interaction.commandName === 'seif') {
            if (interaction.channel.id !== SEIF_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #seif');
            }

            const actiune = interaction.options.getString('actiune');

            const embed = createEmbed(`💰 ${actiune} Seif - IN ASTEPTARE`, 0xfee75c, interaction.user)
                .setDescription(
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

        if (interaction.commandName === 'anunt') {
            if (interaction.channel.id !== ANUNTURI_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #anunturi-ic');
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.editReply('❌ Doar administratorii pot folosi aceasta comanda.');
            }

            const text = interaction.options.getString('text');

            return interaction.editReply({
                content: `📢 **ANUNT O' JASTEMMA**\n\n${text}`,
                allowedMentions: {
                    parse: ['users', 'roles', 'everyone']
                }
            });
        }

        if (interaction.commandName === 'actiune') {
            if (interaction.channel.id !== ANUNTURI_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #anunturi-ic');
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.editReply('❌ Doar administratorii pot folosi aceasta comanda.');
            }

            const locatie = interaction.options.getString('locatie');

            const embed = new EmbedBuilder()
                .setColor(0x57f287)
                .setTitle("--------------- ● ACTIUNE O'JASTEMMA - IN DESFASURARE ● ---------------")
                .setDescription(
`🕘 **Initiere:** ${dataOraRo()}
🛡️ **Locatie:** ${locatie}
🏅 **Coordonator:** ${interaction.user}
👥 **Total participanti:** 0
📋 **Participanti:** N/A
🟢 **Prezenta:** DESCHISA
🟡 **Status:** IN DESFASURARE`
                )
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }));

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('actiune_particip')
                    .setLabel('Particip')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('actiune_nu_particip')
                    .setLabel('Nu mai particip')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId('actiune_stop_prezenta')
                    .setLabel('Opreste prezenta')
                    .setEmoji('⛔')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId('actiune_inchide')
                    .setLabel('Inchide actiunea')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Primary)
            );

            return interaction.editReply({
                embeds: [embed],
                components: [row]
            });
        }

    } catch (error) {
        if (error.code === 10062) {
            console.log('Interactiune expirata.');
            return;
        }

        console.error(error);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const protectedChannels = [
        CHAT_IC_ID,
        CERERE_DEMISIE_ID,
        CERERE_INACTIVITATE_ID,
        SANCTIUNI_ID,
        SEIF_ID,
        ANUNTURI_IC_ID
    ];

    if (protectedChannels.includes(message.channel.id)) {
        try {
            await message.delete();
        } catch {
            console.log('Nu pot sterge mesajul.');
        }
    }
});

client.login(TOKEN);