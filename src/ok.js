"use strict";

function gRC(time, val, sat) {
    const s = Math.floor(time) % 6;
    const t = time % 1;
    let r = 0;
    let g = 0;
    let b = 0;
    switch (s) {
        case 0:
            r = 1;
            g = t;
            break;
        case 1:
            r = 1 - t;
            g = 1;
            break;
        case 2:
            g = 1;
            b = t;
            break;
        case 3:
            g = 1 - t;
            b = 1;
            break;
        case 4:
            b = 1;
            r = t;
            break;
        case 5:
            b = 1 - t;
            r = 1;
            break;
        default:
            throw new Error("Wtf!! Why is there an invalid number?  [" + s + "]");
    }
    r = 1 - (1 - r) * sat;
    g = 1 - (1 - g) * sat;
    b = 1 - (1 - b) * sat;
    r = r * val * 255;
    g = g * val * 255;
    b = b * val * 255;
    return (
        "#" +
        Math.round(r).toString(16).padStart(2, "0") +
        Math.round(g).toString(16).padStart(2, "0") +
        Math.round(b).toString(16).padStart(2, "0")
    );
};

function mixColor(color, nextColor, time) {
    if (color[0] === "#") {
        color = color.slice(1);
    }
    const colorInt = parseInt(color, 16);
    if (nextColor[0] === "#") {
        nextColor = nextColor.slice(1);
    }
    const nextColorInt = parseInt(nextColor, 16);
    let r = ((colorInt >> 16) % 256) / 256;
    let g = ((colorInt >> 8) % 256) / 256;
    let b = (colorInt % 256) / 256;
    const lr = ((nextColorInt >> 16) % 256) / 256;
    const lg = ((nextColorInt >> 8) % 256) / 256;
    const lb = (nextColorInt % 256) / 256;
    r = (r * (1 - time) + lr * time) * 256;
    g = (g * (1 - time) + lg * time) * 256;
    b = (b * (1 - time) + lb * time) * 256;
    return (
        "#" +
        Math.floor(r).toString(16).padStart(2, "0") +
        Math.floor(g).toString(16).padStart(2, "0") +
        Math.floor(b).toString(16).padStart(2, "0")
    );
};

const ELEMENTS = {
    Typeless: "Typeless",
    Normal: "Normal",
    Fire: "Fire",
    Water: "Water",
    Electric: "Electric",
    Grass: "Grass",
    Ice: "Ice",
    Fighting: "Fighting",
    Poison: "Poison",
    Ground: "Ground",
    Flying: "Flying",
    Psychic: "Psychic",
    Bug: "Bug",
    Rock: "Rock",
    Ghost: "Ghost",
    Dragon: "Dragon",
    Dark: "Dark",
    Steel: "Steel",
    Fairy: "Fairy",
    Digital: "Digital",
    CylleneIce: "CylleneIce"
}

let possibleTypeDmg = [0, 0.5, 0.7, 1.4, 2, 4]

const TYPE_LIST = [ELEMENTS.Typeless, ELEMENTS.Normal, ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Electric, ELEMENTS.Grass, ELEMENTS.Ice, ELEMENTS.Fighting, ELEMENTS.Poison, ELEMENTS.Ground, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Bug, ELEMENTS.Rock, ELEMENTS.Ghost, ELEMENTS.Dragon, ELEMENTS.Dark, ELEMENTS.Steel, ELEMENTS.Fairy, ELEMENTS.Digital, ELEMENTS.CylleneIce]

const typeEff = {
    Normal: {
        0: [ELEMENTS.Ghost],
        0.5: [ELEMENTS.Rock, ELEMENTS.Steel]
    },
    Fire: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Rock, ELEMENTS.Dragon],
        2: [ELEMENTS.Grass, ELEMENTS.Ice, ELEMENTS.Bug, ELEMENTS.Steel, ELEMENTS.Digital],
    },
    Water: {
        0.5: [ELEMENTS.Water, ELEMENTS.Grass, ELEMENTS.Dragon],
        0.7: [ELEMENTS.CylleneIce],
        2: [ELEMENTS.Fire, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Digital],
    },
    Electric: {
        0: [ELEMENTS.Ground],
        0.5: [ELEMENTS.Electric, ELEMENTS.Grass, ELEMENTS.Dragon],
        2: [ELEMENTS.Water, ELEMENTS.Flying],
    },
    Grass: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Grass, ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Bug, ELEMENTS.Dragon, ELEMENTS.Steel],
        2: [ELEMENTS.Water, ELEMENTS.Ground, ELEMENTS.Rock],
    },
    Ice: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Ice, ELEMENTS.Steel],
        0.7: [ELEMENTS.CylleneIce],
        2: [ELEMENTS.Grass, ELEMENTS.Ground, ELEMENTS.Flying, ELEMENTS.Dragon],
    },
    Fighting: {
        0: [ELEMENTS.Ghost],
        0.5: [ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Bug, ELEMENTS.Fairy, ELEMENTS.Digital],
        1.4: [ELEMENTS.CylleneIce],
        2: [ELEMENTS.Normal, ELEMENTS.Ice, ELEMENTS.Rock, ELEMENTS.Dark, ELEMENTS.Steel],
    },
    Poison: {
        0: [ELEMENTS.Steel, ELEMENTS.Digital],
        0.5: [ELEMENTS.Poison, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Ghost],
        2: [ELEMENTS.Grass, ELEMENTS.Fairy],
    },
    Ground: {
        0: [ELEMENTS.Flying],
        0.5: [ELEMENTS.Grass, ELEMENTS.Bug],
        2: [ELEMENTS.Fire, ELEMENTS.Electric, ELEMENTS.Poison, ELEMENTS.Rock, ELEMENTS.Steel],
    },
    Flying: {
        0.5: [ELEMENTS.Electric, ELEMENTS.Rock, ELEMENTS.Steel],
        2: [ELEMENTS.Grass, ELEMENTS.Fighting, ELEMENTS.Bug],
    },
    Psychic: {
        0: [ELEMENTS.Dark],
        0.5: [ELEMENTS.Psychic, ELEMENTS.Steel],
        2: [ELEMENTS.Fighting, ELEMENTS.Poison],
    },
    Bug: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Fighting, ELEMENTS.Poison, ELEMENTS.Flying, ELEMENTS.Ghost, ELEMENTS.Steel, ELEMENTS.Fairy],
        2: [ELEMENTS.Grass, ELEMENTS.Psychic, ELEMENTS.Dark],
        4: [ELEMENTS.Digital],
    },
    Rock: {
        0.5: [ELEMENTS.Fighting, ELEMENTS.Ground, ELEMENTS.Steel],
        2: [ELEMENTS.Fire, ELEMENTS.Ice, ELEMENTS.Flying, ELEMENTS.Bug],
    },
    Ghost: {
        0: [ELEMENTS.Normal],
        0.5: [ELEMENTS.Dark],
        2: [ELEMENTS.Psychic, ELEMENTS.Ghost, ELEMENTS.Digital],
    },
    Dragon: {
        0: [ELEMENTS.Fairy],
        0.5: [ELEMENTS.Steel],
        2: [ELEMENTS.Dragon],
    },
    Dark: {
        0.5: [ELEMENTS.Fighting, ELEMENTS.Dark, ELEMENTS.Fairy, ELEMENTS.Digital],
        2: [ELEMENTS.Psychic, ELEMENTS.Ghost],
    },
    Steel: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Water, ELEMENTS.Electric, ELEMENTS.Steel],
        1.4: [ELEMENTS.CylleneIce],
        2: [ELEMENTS.Ice, ELEMENTS.Rock, ELEMENTS.Fairy],
    },
    Fairy: {
        0.5: [ELEMENTS.Fire, ELEMENTS.Poison, ELEMENTS.Steel],
        2: [ELEMENTS.Fighting, ELEMENTS.Dragon, ELEMENTS.Dark],
    },
    Digital: {
        0.5: [ELEMENTS.Ice, ELEMENTS.Ground, ELEMENTS.Rock, ELEMENTS.Fairy],
        0.7: [ELEMENTS.CylleneIce],
        2: [ELEMENTS.Electric, ELEMENTS.Fighting, ELEMENTS.Flying, ELEMENTS.Psychic, ELEMENTS.Ghost, ELEMENTS.Dragon, ELEMENTS.Digital],
    },
    CylleneIce: {
        0.7: [ELEMENTS.Water, ELEMENTS.Ice, ELEMENTS.CylleneIce, ELEMENTS.Steel],
        1.4: [ELEMENTS.Grass, ELEMENTS.Ground, ELEMENTS.Flying, ELEMENTS.Dragon],
    },
    Typeless: {
        1: []
    }
}

function getTypeEffective(attacking, defending) {
    let mul = 1.0;
        for (let i = 0; i < attacking.length; i++) {
            for (let j = 0; j < possibleTypeDmg.length; j++) {
                if (typeEff[attacking[i]][possibleTypeDmg[j]] !== undefined) {
                    let eff = typeEff[attacking[i]][possibleTypeDmg[j]]
                    for (let k = 0; k < defending.length; k++) {
                        if (eff.includes(defending[k])) {
                            mul *= possibleTypeDmg[j];
                        }
                    }
                }
            }
        }
    return mul;
}

function getColor(dmg) {
    if (dmg === 0) {
        return '#808080';
    }
    if (dmg === 1) {
        return '#FFFF00';
    }
    if (dmg > 0.0 && dmg <= 0.5) {
        return mixColor('#FF0000', '#808080', (0.5 - dmg) / 0.5)
    }
    if (dmg > 0.5 && dmg < 1.0) {
        return mixColor('#FFFF00', '#FF0000', (1 - dmg) / 0.5)
    }
    if (dmg > 1.0 && dmg < 2.0) {
        return mixColor('#FFFF00', '#00FF00', dmg - 1)
    }
    if (dmg >= 2.0) {
        return mixColor('#00FF00', '#00FFFF', 1 - (1 / (dmg - 1)))
    }
    throw new Error(`bad argument for getColor: ${dmg}`)
}

function checkEveryType(defending) {
    for (let i = 0; i < TYPE_LIST.length; i++) {
        let dmg = getTypeEffective([TYPE_LIST[i]], defending);
        console.log(`${TYPE_LIST[i]} --%c(${dmg}x)%c-> ${defending}`, `color: ${getColor(dmg)}`, ``);
    }
}

function checkEveryTypeAtkTxt(attacking) {
    let txt = []
    for (let i = 0; i < TYPE_LIST.length; i++) {
        let dmg = getTypeEffective(attacking, [TYPE_LIST[i]]);
        txt.push({
            txt: `${attacking} --(${Math.round(dmg*1000)/1000}x)-> ${TYPE_LIST[i]}`,
            color: getColor(dmg)
        })
    }
    return txt
}

function checkEveryTypeDefTxt(defending) {
    let txt = []
    for (let i = 0; i < TYPE_LIST.length; i++) {
        let dmg = getTypeEffective([TYPE_LIST[i]], defending);
        txt.push({
            txt: `${TYPE_LIST[i]} --(${Math.round(dmg*1000)/1000}x)-> ${defending}`,
            color: getColor(dmg)
        })
    }
    return txt
}

function getTypeText() {
    let txt = "";
    for (let i = 0; i < TYPE_LIST.length - 1; i++) {
        txt += `${TYPE_LIST[i]}, `
    }
    txt += TYPE_LIST[TYPE_LIST.length - 1]
    return txt
}

function getBSL() {
    let html = ``
    for (let i = 0; i < LIST_OF_STATS.length; i++) {
        html += `
            <label for="c${LIST_OF_STATS[i]}">Character ${LIST_OF_STATS[i]}:</label>
            <input type="text" id="c${LIST_OF_STATS[i]}" name="c${LIST_OF_STATS[i]}">
            <label for="cev${LIST_OF_STATS[i]}">EV:</label>
            <input type="text" id="cev${LIST_OF_STATS[i]}" name="cev${LIST_OF_STATS[i]}">
            <label for="civ${LIST_OF_STATS[i]}">IV:</label>
            <input type="text" id="civ${LIST_OF_STATS[i]}" name="civ${LIST_OF_STATS[i]}"><br>
        `
    }
    return html
}

function getNatureList() {
    let html = ``
    for (let i = 0; i < NATURE_LIST.length; i++) {
        html += `
            <option value="${NATURE_LIST[i]}">${NATURE_LIST[i]}</option>
        `
    }
    return html
}

const LIST_OF_STATS = ["HP", "MP", "PATK", "MATK", "PDEF", "MDEF", "SPD", "EVA", "ACC", "Healing Power"]

let factors = []
let tab = 0
function loadScripts() {
    document.getElementById("typeList").innerText = getTypeText()
    document.getElementById("typeList2").innerText = getTypeText()
    document.getElementById("baseStatList").innerHTML = getBSL()
    document.getElementById("cnat").innerHTML = getNatureList()
    document.getElementById('damageCalc').style.display = "none"
    document.getElementById('statCalc').style.display = "none"
    document.getElementById('typeCalc').style.display = "none"
    document.getElementById('hpDmgMine').style.display = "none"
    document.getElementById('hpDmgPkmn').style.display = "none"
}

function calcMine(atk, baseAtk, def, pow, modif) {
    atk = Number(atk)
    def = Number(def)
    pow = Number(pow)
    modif = Number(modif)
    // return (atk ** 3)/((atk + def) ** 2) * modif * pow
    return (modif * pow * baseAtk * atk / def) / 4
}

function calcPkmn(lv, atk, def, pow, modif) {
    atk = Number(atk)
    def = Number(def)
    pow = Number(pow)
    modif = Number(modif)
    lv = Number(lv)
    return (((((2 * lv / 5) + 2) * pow * atk / def) / 50) + 2) * modif
}

function calculateDamage() {
    try {
        factors = []
        let dmg = 1;
        if (document.getElementById('acrit').checked) {
            dmg *= 1.5
            factors.push(`Critical: x1.5`)
        }
        dmg *= Number(document.getElementById('amisc').value)
        factors.push(`Misc: x${document.getElementById('amisc').value}`)
        dmg *= getTypeEffective(document.getElementById('atype').value.replace(/\s/g, '').split(","), document.getElementById('tartype').value.replace(/\s/g, '').split(","))
        factors.push(`Type Effectiveness: x${getTypeEffective(document.getElementById('atype').value.replace(/\s/g, '').split(","), document.getElementById('tartype').value.replace(/\s/g, '').split(","))}`)
        let mydmg = calcMine(document.getElementById('aatk').value, document.getElementById('aatkm').value, document.getElementById('tardef').value, document.getElementById('apow').value/100, dmg)
        document.getElementById('mySystemDmg').innerText = `My system: ${Math.ceil(mydmg)} damage, ${Math.floor(Number(document.getElementById('tarhp').value)-mydmg)} HP remains, ${Math.ceil(mydmg / Number(document.getElementById('tarhp').value)*1000)/10}% damage`
        let pkmndmg = calcPkmn(document.getElementById('alevel').value, document.getElementById('aatkm').value, document.getElementById('tardef').value, document.getElementById('apow').value, dmg)
        document.getElementById('pkmnSystemDmg').innerText = `Pokemon's system: ${Math.ceil(pkmndmg*0.85)}-${Math.ceil(pkmndmg)} damage, ${Math.max(0, Math.floor(Number(document.getElementById('tarhp').value)-pkmndmg))}-${Math.max(0, Math.floor(Number(document.getElementById('tarhp').value)-(pkmndmg*0.85)))} HP remains, ${Math.ceil(0.85 * pkmndmg / Number(document.getElementById('tarhp').value)*1000)/10}-${Math.ceil(pkmndmg / Number(document.getElementById('tarhp').value)*1000)/10}% damage`
    
        let txt = ``
        for (let i = 0; i < factors.length; i++) {
            txt += `${factors[i]}\n`
        }
        document.getElementById('factors').innerText = txt

        document.getElementById('hpDmgMine').style.display = ""
        document.getElementById('hpDamageMineFill').style.width = `${(Math.max(0, 1 - mydmg / Number(document.getElementById('tarhp').value))*100)}%`
        document.getElementById('hpDamageMineBase').style['background-color'] = gRC(Math.max(0, 2.0 * (1 - mydmg / Number(document.getElementById('tarhp').value))), 0.25, 1.0)
        document.getElementById('hpDamageMineFill').style['background-color'] = gRC(Math.max(0, 2.0 * (1 - mydmg / Number(document.getElementById('tarhp').value))), 1.0, 1.0)

        document.getElementById('hpDmgPkmn').style.display = ""
        document.getElementById('hpDamagePkmnFill').style.width = `${(Math.max(0, 1 - pkmndmg / Number(document.getElementById('tarhp').value))*100)}%`
        document.getElementById('hpDamagePkmnBase').style['background-color'] = gRC(Math.max(0, 2.0 * (1 - pkmndmg / Number(document.getElementById('tarhp').value))), 0.25, 1.0)
        document.getElementById('hpDamagePkmnFill').style['background-color'] = gRC(Math.max(0, 2.0 * (1 - pkmndmg / Number(document.getElementById('tarhp').value))), 1.0, 1.0)
    } catch {
        document.getElementById('mySystemDmg').innerText = `Something went wrong! Check your typing inputs and try again.`
    }
}

const NATURE_LIST = [
    "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
    "Bold", "Docile", "Relaxed", "Impish", "Lax",
    "Timid", "Hasty", "Serious", "Jolly", "Naive",
    "Modest", "Mild", "Quiet", "Bashful", "Rash",
    "Calm", "Gentle", "Sassy", "Careful", "Quirky"
]

function calculateStat() {
    const obj = {}
    for (let i = 0; i < LIST_OF_STATS.length; i++) {
        obj[LIST_OF_STATS[i]] = {
            base: Number(document.getElementById(`c${LIST_OF_STATS[i]}`).value),
            ev: Number(document.getElementById(`cev${LIST_OF_STATS[i]}`).value),
            iv: Number(document.getElementById(`civ${LIST_OF_STATS[i]}`).value)
        }
    }
    const level = Number(document.getElementById('clevel').value)
    let nature = NATURE_LIST.indexOf(document.getElementById('cnat').value)
    let natureUp = ["PATK", "PDEF", "SPD", "MATK", "MDEF"][Math.floor(nature / 5)]
    let natureDown = ["PATK", "PDEF", "SPD", "MATK", "MDEF"][nature % 5]
    for (let i = 0; i < LIST_OF_STATS.length; i++) {
        let natureEff = 1
        if (natureUp === LIST_OF_STATS[i]) {
            natureEff += 0.1
        }
        if (natureDown === LIST_OF_STATS[i]) {
            natureEff -= 0.1
        }
        switch (document.getElementById('cstat').value) {
            case "pkmng":
                if (LIST_OF_STATS[i] === "HP") {
                    obj[LIST_OF_STATS[i]].true = 10 + level + Math.floor((2 * (obj[LIST_OF_STATS[i]].base + obj[LIST_OF_STATS[i]].iv) + Math.floor(Math.ceil(Math.sqrt(obj[LIST_OF_STATS[i]].ev)) / 4)) * level / 100)
                } else {
                    obj[LIST_OF_STATS[i]].true = 5 + Math.floor((2 * (obj[LIST_OF_STATS[i]].base + obj[LIST_OF_STATS[i]].iv) + Math.floor(Math.ceil(Math.sqrt(obj[LIST_OF_STATS[i]].ev)) / 4)) * level / 100)
                }
                break;
            case "pkmn":
                if (LIST_OF_STATS[i] === "HP") {
                    obj[LIST_OF_STATS[i]].true = 10 + level + Math.floor(((2 * obj[LIST_OF_STATS[i]].base) + obj[LIST_OF_STATS[i]].iv + Math.floor(obj[LIST_OF_STATS[i]].ev / 4)) * level / 100)
                } else {
                    obj[LIST_OF_STATS[i]].true = Math.floor(natureEff * (5 + Math.floor(((2 * obj[LIST_OF_STATS[i]].base) + obj[LIST_OF_STATS[i]].iv + Math.floor(obj[LIST_OF_STATS[i]].ev / 4)) * level / 100)))
                }
                break;
            case "t1":
                obj[LIST_OF_STATS[i]].true = obj[LIST_OF_STATS[i]].base * (2 + ((level - 1) / 11) * (1 + 0.02 * Math.floor(level / 4)) * (1 + Math.floor(level / 10) / 60) * (1 + Math.floor(level / 50) / 14))
                break;
            case "t2":
                obj[LIST_OF_STATS[i]].true = obj[LIST_OF_STATS[i]].base * 1.5 * (0.1 + (level - 1) / 110) * (1 + 0.025 * Math.floor(level / 4)) * (1 + 0.05 * Math.floor(level / 10)) * (1 + 0.1 * Math.floor(level / 50))
                break;
            case "t3":
                if (LIST_OF_STATS[i] === "HP") {
                    obj[LIST_OF_STATS[i]].true = 10 + level + (100 * (level - 1) * Math.sqrt(obj[LIST_OF_STATS[i]].ev) / 25343) + (0.1 * ((level + 10) / 11) * obj[LIST_OF_STATS[i]].iv) + (obj[LIST_OF_STATS[i]].base * (level - 1) / 55) * (1 + 0.01 * Math.floor(level / 4) + 0.025 * Math.floor(level / 10) + 0.25 * Math.floor(level / 50))
                } else {
                    obj[LIST_OF_STATS[i]].true = natureEff * (5 + (100 * (level - 1) * Math.sqrt(obj[LIST_OF_STATS[i]].ev) / 25343) + (0.1 * ((level + 10) / 11) * obj[LIST_OF_STATS[i]].iv) + (obj[LIST_OF_STATS[i]].base * (level - 1) / 55) * (1 + 0.01 * Math.floor(level / 4) + 0.025 * Math.floor(level / 10) + 0.25 * Math.floor(level / 50)))
                }
                break;
            case "t4":
                obj[LIST_OF_STATS[i]].true = natureEff * obj[LIST_OF_STATS[i]].base * (0.01 * (0.49 * level + 1)) * (1 + 0.02 * Math.floor(level / 4)) * (1 + Math.floor(level / 10) / 60) * (1 + Math.floor(level / 50) / 14) * (0.95 + 0.1 * obj[LIST_OF_STATS[i]].iv / 32) * (1 + 0.2 * obj[LIST_OF_STATS[i]].ev / 252)
                break;
            default:
                throw new Error(`bad arguments for stats! ${document.getElementById('cstat').value} doesn't exist`)
        }
    }

    // let txt = ``
    // for (let i = 0; i < LIST_OF_STATS.length; i++) {
    //     txt += `
    //     ${LIST_OF_STATS[i]}: ${Math.floor(obj[LIST_OF_STATS[i]].true)}<br>
    //     `
    // }

    // document.getElementById('callstats').innerHTML = txt

    let max = {
        pkmng: 255,
        pkmn: 255,
        t1: 50,
        t2: 200,
        t3: 200,
        t4: 999
    }[document.getElementById('cstat').value]

    let txt = ``
    for (let i = 0; i < LIST_OF_STATS.length; i++) {
        txt += `
        ${LIST_OF_STATS[i]}: ${Math.floor(obj[LIST_OF_STATS[i]].true)}
        <div id="graph${LIST_OF_STATS[i]}" style="height: 20px; width: 600px; position: relative;">
            <div id="graph${LIST_OF_STATS[i]}Base" style="background-color: ${gRC(3.0 * Math.min(1, obj[LIST_OF_STATS[i]].base / max), 0.25, 1.0)}; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"></div>
            <div id="graph${LIST_OF_STATS[i]}Fill" style="background-color: ${gRC(3.0 * Math.min(1, obj[LIST_OF_STATS[i]].base / max), 1.0, 1.0)}; position: absolute; top: 0; left: 0; height: 100%; width: ${100 * Math.min(1, obj[LIST_OF_STATS[i]].base / max)}%;"></div>
        </div>
        `
    }
    document.getElementById('cstatsgraph').innerHTML = txt

}

function switchTab(id) {
    document.getElementById('damageCalc').style.display = id === 0 ? "" : "none"
    document.getElementById('statCalc').style.display = id === 1 ? "" : "none"
    document.getElementById('typeCalc').style.display = id === 2 ? "" : "none"
}

function calculateType(f) {
    try {
        let txt2 = ``
        if (f === 0) {
            let txt = checkEveryTypeDefTxt(document.getElementById('ttype').value.replace(/\s/g, '').split(","))
            for (let i = 0; i < txt.length; i++) {
                txt2 += `<span style="color: ${txt[i].color}">${txt[i].txt}</span><br>`
            }
        }
        if (f === 1) {
            let txt = checkEveryTypeAtkTxt(document.getElementById('ttype').value.replace(/\s/g, '').split(","))
            for (let i = 0; i < txt.length; i++) {
                txt2 += `<span style="color: ${txt[i].color}">${txt[i].txt}</span><br>`
            }
        }
        
        document.getElementById('typecalcc').innerHTML = txt2
    } catch {
        document.getElementById('typecalcc').innerHTML = `Something went wrong! Check your typing inputs and try again.`
    }
}