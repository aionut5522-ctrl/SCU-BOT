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
const CRAFT_ID = '1508558446029705356';

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

function formatMoney(n) {
    return `${Math.round(n).toLocaleString('ro-RO')}$`;
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

function craftDroguri(item, cantitate, procentSpalare) {
    if (item === 'cocaina') {
        const frunze = cantitate * 3;
        const sodiu = cantitate / 4;
        const amoniac = cantitate / 4;
        const plicuri = cantitate;

        const investitie = (sodiu * 4500) + (amoniac * 4500) + (plicuri * 150);
        const murdari = cantitate * 4862;
        const curatiDupaSpalare = murdari * (procentSpalare / 100);
        const profit = curatiDupaSpalare - investitie;

        return {
            title: `🧪 Craft Cocaina x${cantitate}`,
            description:
`🌿 **Frunze Coca:** ${frunze}
🧂 **Sodiu:** ${sodiu}
⚗️ **Amoniac:** ${amoniac}
📦 **Plicuri:** ${plicuri}

💰 **Investitie:** ${formatMoney(investitie)} curati
💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Procent spalare:** ${procentSpalare}%
💵 **Bani curati dupa spalare:** ${formatMoney(curatiDupaSpalare)}
📈 **Profit net:** ${formatMoney(profit)}`
        };
    }

    if (item === 'crack') {
        const plicuriCocaina = cantitate / 2;
        const brichete = cantitate / 2;
        const apa = cantitate;

        const investitieCocaina = plicuriCocaina * 2400;
        const investitieCrack = cantitate * 140;
        const investitieTotala = investitieCocaina + investitieCrack;

        const murdari = cantitate * 3180;
        const curatiDupaSpalare = murdari * (procentSpalare / 100);
        const profit = curatiDupaSpalare - investitieTotala;

        return {
            title: `🧊 Craft Crack x${cantitate}`,
            description:
`🧪 **Plicuri Cocaina necesare:** ${plicuriCocaina}
🔥 **Brichete:** ${brichete}
💧 **Apa:** ${apa}

💰 **Investitie cocaina:** ${formatMoney(investitieCocaina)}
💰 **Investitie crack:** ${formatMoney(investitieCrack)}
💰 **Investitie totala:** ${formatMoney(investitieTotala)}

💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Procent spalare:** ${procentSpalare}%
💵 **Bani curati dupa spalare:** ${formatMoney(curatiDupaSpalare)}
📈 **Profit net:** ${formatMoney(profit)}`
        };
    }

    if (item === 'tigari') {
        const frunze = cantitate * 20;
        const foite = cantitate * 5;
        const filtre = cantitate * 5;
        const rasnite = cantitate * 2;
        const pacheteGoale = cantitate;

        const investitie = cantitate * 3000;
        const murdari = cantitate * 5700;
        const curatiDupaSpalare = murdari * (procentSpalare / 100);
        const profit = curatiDupaSpalare - investitie;

        return {
            title: `🚬 Craft Tigari x${cantitate}`,
            description:
`🌿 **Frunze:** ${frunze}
📄 **Foite:** ${foite}
🧻 **Filtre:** ${filtre}
⚙️ **Rasnite:** ${rasnite}
📦 **Pachete goale:** ${pacheteGoale}

💰 **Investitie:** ${formatMoney(investitie)} curati
💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Procent spalare:** ${procentSpalare}%
💵 **Bani curati dupa spalare:** ${formatMoney(curatiDupaSpalare)}
📈 **Profit net:** ${formatMoney(profit)}`
        };
    }

    return null;
}

function craftArme(item, cantitate) {
    const arme = {
        pistol: {
            title: '🔫 Craft Pistol',
            cost: 13000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 1
            }
        },
        pistolmk2: {
            title: '🔫 Craft Pistol MK2',
            cost: 32500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            }
        },
        pistol50: {
            title: '🔫 Craft Pistol50',
            cost: 32500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            }
        },
        microsmg: {
            title: '🔫 Craft Micro SMG',
            cost: 39000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            }
        },
        machinepistol: {
            title: '🔫 Craft Machine Pistol',
            cost: 97500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 5
            }
        },
        compactrifle: {
            title: '🔫 Craft Compact Rifle',
            cost: 117000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 12
            }
        },
        gusenberg: {
            title: '🔫 Craft Gusenberg',
            cost: 162500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 13
            }
        }
    };

    const arma = arme[item];
    if (!arma) return null;

    let materialeText = '';

    for (const [nume, valoare] of Object.entries(arma.materiale)) {
        materialeText += `• **${nume}:** ${valoare * cantitate}\n`;
    }

    const costTotal = arma.cost * cantitate;

    return {
        title: `${arma.title} x${cantitate}`,
        description:
`📦 **Materiale necesare:**
${materialeText}
💰 **Cost total:** ${formatMoney(costTotal)} murdari`
    };
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
        .addStringOption(o => o.setName('locatie').setDescription('Locatia actiunii').setRequired(true)),

    new SlashCommandBuilder()
        .setName('craft')
        .setDescription('Calculator craft')
        .addStringOption(o =>
            o.setName('categorie')
                .setDescription('Categoria craftului')
                .setRequired(true)
                .addChoices(
                    { name: 'Droguri', value: 'droguri' },
                    { name: 'Arme', value: 'arme' }
                )
        )
        .addStringOption(o =>
            o.setName('item')
                .setDescription('Ce vrei sa calculezi')
                .setRequired(true)
                .addChoices(
                    { name: 'Cocaina', value: 'cocaina' },
                    { name: 'Crack', value: 'crack' },
                    { name: 'Tigari', value: 'tigari' },
                    { name: 'Pistol', value: 'pistol' },
                    { name: 'Pistol MK2', value: 'pistolmk2' },
                    { name: 'Pistol50', value: 'pistol50' },
                    { name: 'Micro SMG', value: 'microsmg' },
                    { name: 'Machine Pistol', value: 'machinepistol' },
                    { name: 'Compact Rifle', value: 'compactrifle' },
                    { name: 'Gusenberg', value: 'gusenberg' }
                )
        )
        .addIntegerOption(o => o.setName('cantitate').setDescription('Cantitatea dorita').setRequired(true))
        .addNumberOption(o => o.setName('procent_spalare').setDescription('Procent spalare bani murdari').setRequired(false))
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
                        return interaction.reply({ content: '❌ Prezenta este oprita.', flags: 64 });
                    }

                    if (!participants.includes(interaction.user.id)) {
                        participants.push(interaction.user.id);
                    }
                }

                if (interaction.customId === 'actiune_nu_particip') {
                    if (prezentaOprita || actiuneInchisa) {
                        return interaction.reply({ content: '❌ Prezenta este oprita.', flags: 64 });
                    }

                    participants = participants.filter(id => id !== interaction.user.id);
                }

                if (interaction.customId === 'actiune_stop_prezenta') {
                    if (!isAdmin) {
                        return interaction.reply({ content: '❌ Doar administratorii pot opri prezenta.', flags: 64 });
                    }

                    desc = desc.replace('🟢 **Prezenta:** DESCHISA', '⛔ **Prezenta:** OPRITA');
                }

                if (interaction.customId === 'actiune_inchide') {
                    if (!isAdmin) {
                        return interaction.reply({ content: '❌ Doar administratorii pot inchide actiunea.', flags: 64 });
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
                    flags: 64
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

        const isCraft = interaction.commandName === 'craft';

        if (isCraft) {
            await interaction.deferReply({ flags: 64 });
        } else {
            await interaction.deferReply();
        }

        if (interaction.commandName === 'craft') {
            if (interaction.channel.id !== CRAFT_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda doar in canalul de craft.');
            }

            const categorie = interaction.options.getString('categorie');
            const item = interaction.options.getString('item');
            const cantitate = interaction.options.getInteger('cantitate');
            const procentSpalare = interaction.options.getNumber('procent_spalare') ?? 100;

            if (cantitate <= 0) {
                return interaction.editReply('❌ Cantitatea trebuie sa fie mai mare decat 0.');
            }

            const droguri = ['cocaina', 'crack', 'tigari'];
            const arme = ['pistol', 'pistolmk2', 'pistol50', 'microsmg', 'machinepistol', 'compactrifle', 'gusenberg'];

            if (categorie === 'droguri' && !droguri.includes(item)) {
                return interaction.editReply('❌ Ai ales categoria Droguri, dar itemul nu este drog.');
            }

            if (categorie === 'arme' && !arme.includes(item)) {
                return interaction.editReply('❌ Ai ales categoria Arme, dar itemul nu este arma.');
            }

            let result = null;

            if (categorie === 'droguri') {
                result = craftDroguri(item, cantitate, procentSpalare);
            }

            if (categorie === 'arme') {
                result = craftArme(item, cantitate);
            }

            if (!result) {
                return interaction.editReply('❌ Craft invalid.');
            }

            const embed = new EmbedBuilder()
                .setColor(0xc49a5a)
                .setTitle(result.title)
                .setDescription(result.description)
                .setFooter({ text: `O' Jastemma • Calculator Craft` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch {}
            }, 600000);

            return;
        }

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
        ANUNTURI_IC_ID,
        CRAFT_ID
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