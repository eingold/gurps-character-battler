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