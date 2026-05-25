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
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
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
        const baniCurati = murdari * ((100 - procentSpalare) / 100);
        const profit = baniCurati - investitie;

        return {
            title: `🧪 Craft Cocaina x${cantitate}`,
            description:
`🌿 **Frunze Coca:** ${frunze}
🧂 **Sodiu:** ${sodiu}
⚗️ **Amoniac:** ${amoniac}
📦 **Plicuri:** ${plicuri}

💰 **Investitie:** ${formatMoney(investitie)}
💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Taxa spalare:** ${procentSpalare}%

💵 **Bani curati finali:** ${formatMoney(baniCurati)}
📈 **Profit net:** ${formatMoney(profit)}`
        };
    }

    if (item === 'crack') {
        const plicuriCocaina = cantitate / 2;
        const brichete = cantitate / 2;
        const apa = cantitate;

        const investitie = cantitate * 140;
        const murdari = cantitate * 3180;
        const baniCurati = murdari * ((100 - procentSpalare) / 100);
        const profit = baniCurati - investitie;

        return {
            title: `🧊 Craft Crack x${cantitate}`,
            description:
`🧪 **Plicuri Cocaina:** ${plicuriCocaina}
🔥 **Brichete:** ${brichete}
💧 **Apa:** ${apa}

💰 **Investitie:** ${formatMoney(investitie)}
💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Taxa spalare:** ${procentSpalare}%

💵 **Bani curati finali:** ${formatMoney(baniCurati)}
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
        const baniCurati = murdari * ((100 - procentSpalare) / 100);
        const profit = baniCurati - investitie;

        return {
            title: `🚬 Craft Tigari x${cantitate}`,
            description:
`🌿 **Frunze:** ${frunze}
📄 **Foite:** ${foite}
🧻 **Filtre:** ${filtre}
⚙️ **Rasnite:** ${rasnite}
📦 **Pachete goale:** ${pacheteGoale}

💰 **Investitie:** ${formatMoney(investitie)}
💸 **Bani murdari:** ${formatMoney(murdari)}
🧼 **Taxa spalare:** ${procentSpalare}%

💵 **Bani curati finali:** ${formatMoney(baniCurati)}
📈 **Profit net:** ${formatMoney(profit)}`
        };
    }

    return null;
}
function craftArme(item, cantitate, atasamenteInput) {
    const arme = {
        pistol: {
            title: '🔫 Craft Pistol',
            cost: 13000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 1
            },
            atasamente: ['extended', 'flashlight', 'suppressor']
        },

        pistolmk2: {
            title: '🔫 Craft Pistol MK2',
            cost: 32500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            },
            atasamente: ['extended', 'flashlight', 'suppressor', 'scope', 'compensator']
        },

        pistol50: {
            title: '🔫 Craft Pistol50',
            cost: 32500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            },
            atasamente: ['extended', 'flashlight', 'suppressor']
        },

        microsmg: {
            title: '🔫 Craft Micro SMG',
            cost: 39000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 3
            },
            atasamente: ['extended', 'flashlight', 'suppressor', 'scope']
        },

        machinepistol: {
            title: '🔫 Craft Machine Pistol',
            cost: 97500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 5
            },
            atasamente: ['extended', 'suppressor']
        },

        compactrifle: {
            title: '🔫 Craft Compact Rifle',
            cost: 117000,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 12
            },
            atasamente: ['extended']
        },

        gusenberg: {
            title: '🔫 Craft Gusenberg',
            cost: 162500,
            materiale: {
                Teava: 1,
                Cadru: 1,
                Mecanism: 1,
                'Element Fixare': 13
            },
            atasamente: []
        }
    };

    const atasamenteData = {
        extended: {
            'Element Fixare': 3,
            Otel: 1,
            Arc: 5
        },
        flashlight: {
            'Element Fixare': 1,
            Otel: 1,
            Bec: 1,
            Lupa: 2
        },
        suppressor: {
            'Element Fixare': 3,
            Otel: 1,
            Cauciuc: 3
        },
        scope: {
            'Element Fixare': 1,
            Otel: 1,
            Lupa: 2
        },
        compensator: {
            'Element Fixare': 1,
            Otel: 1
        }
    };

    const arma = arme[item];

    if (!arma) return null;

    let materialeTotale = {};

    for (const [nume, valoare] of Object.entries(arma.materiale)) {
        materialeTotale[nume] = (materialeTotale[nume] || 0) + (valoare * cantitate);
    }

    let atasamenteFolosite = [];
    const input = (atasamenteInput || 'fara').toLowerCase().trim();

    if (input === 'toate') {
        atasamenteFolosite = arma.atasamente;
    } else if (input !== 'fara' && input !== '') {
        atasamenteFolosite = input
            .split(',')
            .map(a => a.trim())
            .filter(Boolean);
    }

    const invalide = atasamenteFolosite.filter(a => !arma.atasamente.includes(a));

    if (invalide.length > 0) {
        return {
            error: `❌ Atasamente invalide pentru arma aleasa: ${invalide.join(', ')}\nDisponibile: ${arma.atasamente.length ? arma.atasamente.join(', ') : 'niciunul'}`
        };
    }

    for (const atasament of atasamenteFolosite) {
        const data = atasamenteData[atasament];
        if (!data) continue;

        for (const [nume, valoare] of Object.entries(data)) {
            materialeTotale[nume] = (materialeTotale[nume] || 0) + (valoare * cantitate);
        }
    }

    let materialeText = '';

    for (const [nume, valoare] of Object.entries(materialeTotale)) {
        materialeText += `• **${nume}:** ${valoare}\n`;
    }

    const costTotal = arma.cost * cantitate;

    return {
        title: `${arma.title} x${cantitate}`,
        description:
`📦 **Materiale necesare:**
${materialeText}

🔧 **Atasamente:** ${atasamenteFolosite.length ? atasamenteFolosite.join(', ') : 'Fara'}

💰 **Cost total:** ${formatMoney(costTotal)} murdari`
    };
}
const commands = [
    new SlashCommandBuilder()
        .setName('me')
        .setDescription('Actiune roleplay')
        .addStringOption(o =>
            o.setName('text')
                .setDescription('Text')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('sanctiune')
        .setDescription('Acorda o sanctiune')
        .addUserOption(o =>
            o.setName('persoana')
                .setDescription('Persoana sanctionata')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('sanctiune')
                .setDescription('Tip sanctiune')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('motiv')
                .setDescription('Motiv')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('demisie')
        .setDescription('Cerere demisie'),

    new SlashCommandBuilder()
        .setName('concediu')
        .setDescription('Cerere concediu'),

    new SlashCommandBuilder()
        .setName('invoiresedinta')
        .setDescription('Cerere invoire sedinta'),

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
        .addStringOption(o =>
            o.setName('numeic')
                .setDescription('Nume IC')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('cnp')
                .setDescription('CNP')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('suma')
                .setDescription('Suma/materiale')
                .setRequired(true)
        )
        .addStringOption(o =>
            o.setName('dovada')
                .setDescription('Dovada')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('anunt')
        .setDescription('Anunt IC')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o =>
            o.setName('text')
                .setDescription('Text anunt')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('actiune')
        .setDescription("Creeaza o actiune")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o =>
            o.setName('locatie')
                .setDescription('Locatie')
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName('limita')
                .setDescription('Limita participanti optionala')
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName('craft')
        .setDescription('Calculator craft')
        .addStringOption(o =>
            o.setName('tip')
                .setDescription('Tip craft')
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
        .addIntegerOption(o =>
            o.setName('cantitate')
                .setDescription('Cantitate')
                .setRequired(true)
        )
        .addNumberOption(o =>
            o.setName('procent_spalare')
                .setDescription('Taxa spalare bani pentru droguri')
                .setRequired(false)
        )
        .addStringOption(o =>
            o.setName('atasamente')
                .setDescription('Pentru arme: fara / toate / extended,suppressor')
                .setRequired(false)
        )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`✅ Bot online: ${client.user.tag}`);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [] }
        );

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

                const limitaMatch = desc.match(/👥 \*\*Total participanti:\*\* \d+\/(\d+)/);
                const limita = limitaMatch ? Number(limitaMatch[1]) : null;

                if (interaction.customId === 'actiune_particip') {
                    if (prezentaOprita || actiuneInchisa) {
                        return interaction.reply({
                            content: '❌ Prezenta este oprita.',
                            flags: 64
                        });
                    }

                    if (limita && participants.length >= limita && !participants.includes(interaction.user.id)) {
                        return interaction.reply({
                            content: '❌ Limita de participanti a fost atinsa.',
                            flags: 64
                        });
                    }

                    if (!participants.includes(interaction.user.id)) {
                        participants.push(interaction.user.id);
                    }
                }

                if (interaction.customId === 'actiune_nu_particip') {
                    if (prezentaOprita || actiuneInchisa) {
                        return interaction.reply({
                            content: '❌ Prezenta este oprita.',
                            flags: 64
                        });
                    }

                    participants = participants.filter(id => id !== interaction.user.id);
                }

                if (interaction.customId === 'actiune_stop_prezenta') {
                    if (!isAdmin) {
                        return interaction.reply({
                            content: '❌ Doar administratorii pot opri prezenta.',
                            flags: 64
                        });
                    }

                    desc = desc.replace(
                        '🟢 **Prezenta:** DESCHISA',
                        '⛔ **Prezenta:** OPRITA'
                    );
                }

                if (interaction.customId === 'actiune_inchide') {
                    if (!isAdmin) {
                        return interaction.reply({
                            content: '❌ Doar administratorii pot inchide actiunea.',
                            flags: 64
                        });
                    }

                    desc = desc.replace(
                        '🟢 **Prezenta:** DESCHISA',
                        '⛔ **Prezenta:** OPRITA'
                    );

                    desc = desc.replace(
                        '🟡 **Status:** IN DESFASURARE',
                        '🔒 **Status:** INCHISA'
                    );

                    desc += `\n🔒 **Inchisa la:** ${dataOraRo()}`;

                    embed.setTitle(
                        "--------------- ● ACTIUNE O'JASTEMMA - INCHISA ● ---------------"
                    );

                    embed.setColor(0xed4245);

                    const lista = participants.length
                        ? participants.map(id => `<@${id}>`).join(', ')
                        : 'N/A';

                    desc = desc.replace(
                        /👥 \*\*Total participanti:\*\* .*/g,
                        `👥 **Total participanti:** ${limita ? `${participants.length}/${limita}` : participants.length}`
                    );

                    desc = desc.replace(
                        /📋 \*\*Participanti:\*\* .*/g,
                        `📋 **Participanti:** ${lista}`
                    );

                    embed.setDescription(desc);

                    return interaction.update({
                        embeds: [embed],
                        components: []
                    });
                }

                const lista = participants.length
                    ? participants.map(id => `<@${id}>`).join(', ')
                    : 'N/A';

                desc = desc.replace(
                    /👥 \*\*Total participanti:\*\* .*/g,
                    `👥 **Total participanti:** ${limita ? `${participants.length}/${limita}` : participants.length}`
                );

                desc = desc.replace(
                    /📋 \*\*Participanti:\*\* .*/g,
                    `📋 **Participanti:** ${lista}`
                );

                embed.setDescription(desc);

                return interaction.update({
                    embeds: [embed]
                });
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

        // FORMULARELE NU AU deferReply()
        if (interaction.commandName === 'demisie') {
            if (interaction.channel.id !== CERERE_DEMISIE_ID) {
                return interaction.reply({
                    content: '❌ Foloseste aceasta comanda in #cerere-demisie',
                    flags: 64
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_demisie')
                .setTitle('Cerere Demisie');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('nume')
                        .setLabel('Nume IC')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('cnp')
                        .setLabel('CNP')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('motiv')
                        .setLabel('Motiv')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('zile')
                        .setLabel('Zile')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('rank')
                        .setLabel('Rank')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
            );

            return interaction.showModal(modal);
        }

        if (interaction.commandName === 'concediu') {
            if (interaction.channel.id !== CERERE_INACTIVITATE_ID) {
                return interaction.reply({
                    content: '❌ Foloseste aceasta comanda in #cerere-inactivitate',
                    flags: 64
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_concediu')
                .setTitle('Cerere Concediu');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('perioada')
                        .setLabel('Perioada')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('zile')
                        .setLabel('Numar zile')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('motiv')
                        .setLabel('Motiv')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('detalii')
                        .setLabel('Detalii')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                )
            );

            return interaction.showModal(modal);
        }

        if (interaction.commandName === 'invoiresedinta') {
            if (interaction.channel.id !== CERERE_INACTIVITATE_ID) {
                return interaction.reply({
                    content: '❌ Foloseste aceasta comanda in #cerere-inactivitate',
                    flags: 64
                });
            }

            const modal = new ModalBuilder()
                .setCustomId('modal_invoiresedinta')
                .setTitle('Invoire Sedinta');

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('data')
                        .setLabel('Data sedintei')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('motiv')
                        .setLabel('Motiv')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                )
            );

            return interaction.showModal(modal);
        }

        const ephemeralCraft = interaction.commandName === 'craft';

        if (ephemeralCraft) {
            await interaction.deferReply({ flags: 64 });
        } else {
            await interaction.deferReply();
        }

        // /craft
        if (interaction.commandName === 'craft') {
            if (interaction.channel.id !== CRAFT_ID) {
                return interaction.editReply(
                    '❌ Foloseste aceasta comanda doar in canalul de craft.'
                );
            }

            const tip = interaction.options.getString('tip');
            const cantitate = interaction.options.getInteger('cantitate');
            const procentSpalare = interaction.options.getNumber('procent_spalare') ?? 25;
            const atasamente = interaction.options.getString('atasamente') || 'fara';

            if (cantitate <= 0) {
                return interaction.editReply('❌ Cantitatea trebuie sa fie mai mare decat 0.');
            }

            const droguri = ['cocaina', 'crack', 'tigari'];
            const arme = [
                'pistol',
                'pistolmk2',
                'pistol50',
                'microsmg',
                'machinepistol',
                'compactrifle',
                'gusenberg'
            ];

            let result = null;

            if (droguri.includes(tip)) {
                result = craftDroguri(tip, cantitate, procentSpalare);
            }

            if (arme.includes(tip)) {
                result = craftArme(tip, cantitate, atasamente);
            }

            if (!result) {
                return interaction.editReply('❌ Tip de craft invalid.');
            }

            if (result.error) {
                return interaction.editReply(result.error);
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
                // /me
        if (interaction.commandName === 'me') {
            if (interaction.channel.id !== CHAT_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #chat-ic');
            }

            const text = interaction.options.getString('text');
            return interaction.editReply(`💬 ***${interaction.user.username}*** spune: ***${text}***`);
        }

        // /sanctiune
        if (interaction.commandName === 'sanctiune') {
            if (interaction.channel.id !== SANCTIUNI_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #sanctiuni');
            }

            const persoana = interaction.options.getUser('persoana');
            const sanctiune = interaction.options.getString('sanctiune');
            const motiv = interaction.options.getString('motiv');

            const embed = createEmbed('🔴 Sanctiune - IN ASTEPTARE', 0xfee75c, persoana)
                .setDescription(
`📅 **Data:** ${dataRo()}
👤 **Persoana sanctionata:** ${persoana}
⚠️ **Sanctiune:** ${sanctiune}
📋 **Motiv:** ${motiv}`
                );

            return interaction.editReply({
                embeds: [embed],
                components: [createButtons('sanctiune')]
            });
        }

        // /seif
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

        // /anunt
        if (interaction.commandName === 'anunt') {
            if (interaction.channel.id !== ANUNTURI_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #anunturi-ic');
            }

            const text = interaction.options.getString('text');

            return interaction.editReply({
                content: `📢 **ANUNT O' JASTEMMA**\n\n${text}`,
                allowedMentions: {
                    parse: ['users', 'roles', 'everyone']
                }
            });
        }

        // /actiune
        if (interaction.commandName === 'actiune') {
            if (interaction.channel.id !== ANUNTURI_IC_ID) {
                return interaction.editReply('❌ Foloseste aceasta comanda in #anunturi-ic');
            }

            const locatie = interaction.options.getString('locatie');
            const limita = interaction.options.getInteger('limita');

            const embed = new EmbedBuilder()
                .setColor(0x57f287)
                .setTitle("--------------- ● ACTIUNE O'JASTEMMA - IN DESFASURARE ● ---------------")
                .setDescription(
`🕘 **Initiere:** ${dataOraRo()}
🛡️ **Locatie:** ${locatie}
🏅 **Coordonator:** ${interaction.user}
👥 **Total participanti:** ${limita ? `0/${limita}` : '0'}
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
client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isModalSubmit()) return;

        // FORMULAR DEMISIE
        if (interaction.customId === 'modal_demisie') {
            const embed = createEmbed('📄 Cerere Demisie - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`👤 **Nume:** ${interaction.fields.getTextInputValue('nume')}
🪪 **CNP:** ${interaction.fields.getTextInputValue('cnp')}
📋 **Motiv:** ${interaction.fields.getTextInputValue('motiv')}
📅 **Zile:** ${interaction.fields.getTextInputValue('zile')}
🎖️ **Rank:** ${interaction.fields.getTextInputValue('rank')}`
                );

            return interaction.reply({
                embeds: [embed],
                components: [createButtons('demisie')]
            });
        }

        // FORMULAR CONCEDIU
        if (interaction.customId === 'modal_concediu') {
            const embed = createEmbed('🟡 Cerere Concediu - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`📆 **Perioada:** ${interaction.fields.getTextInputValue('perioada')}
🔢 **Numar zile:** ${interaction.fields.getTextInputValue('zile')}
📋 **Motiv:** ${interaction.fields.getTextInputValue('motiv')}
📌 **Detalii:** ${interaction.fields.getTextInputValue('detalii') || 'N/A'}`
                );

            return interaction.reply({
                embeds: [embed],
                components: [createButtons('concediu')]
            });
        }

        // FORMULAR INVOIRE SEDINTA
        if (interaction.customId === 'modal_invoiresedinta') {
            const embed = createEmbed('🟡 Cerere Invoire Sedinta - IN ASTEPTARE', 0xfee75c, interaction.user)
                .setDescription(
`👤 **Utilizator:** ${interaction.user}
📅 **Data sedintei:** ${interaction.fields.getTextInputValue('data')}
📋 **Motiv:** ${interaction.fields.getTextInputValue('motiv')}`
                );

            return interaction.reply({
                embeds: [embed],
                components: [createButtons('invoiresedinta')]
            });
        }

    } catch (error) {
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