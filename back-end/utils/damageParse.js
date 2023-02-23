import { d6 } from "./diceRolls.js";

export const damageParse = damage => {
    console.log(damage);
    let dice = damage.split('d')[0];
    let adds = parseInt(damage.split('d')[1]) ? parseInt(damage.split('d')[1]) : 0;
    let damageTotal = adds;
    for (let i = 0; i < dice; i++) {
        damageTotal += d6();
    }
    console.log(damageTotal);
    return Math.max(0, damageTotal);
}

export const damageTypeParse = damage => {
    let type = damage.split(' ')[1];
    switch (type) {
        case "cr":
            return "crushing";
        case "cut":
            return "cutting";
        case "imp":
            return "impaling";
        case "pi-":
            return "small piercing";
        case "pi":
            return "piercing";
        case "pi+":
            return "large piercing";
        case "pi++":
            return "huge piercing";
        case "burn":
            return "burning";
        case "cor":
            return "corrosion";
        case "tox":
            return "toxic";
        case "fat":
            return "fatigue";
        default:
            return "injury";
    }
}