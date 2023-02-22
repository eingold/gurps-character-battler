export const d6 = () => {
    return Math.floor(Math.random() * 6) + 1;
}

export const successRoll = (target, modifiers = 0) => {
    target = parseInt(target);
    const roll = d6() + d6() + d6();
    console.log(`roll: ${roll}`);
    const effectiveTarget = target + modifiers;
    console.log(`target: ${effectiveTarget}`);
    if (roll <= 4) return { result: "Critical success", margin: Math.max(0, effectiveTarget - roll), value: roll };
    if (effectiveTarget >= 15 && roll === 5) return { result: "Critical success", margin: Math.max(0, effectiveTarget - roll), value: roll };
    if (effectiveTarget >= 16 && roll === 6) return { result: "Critical success", margin: Math.max(0, effectiveTarget - roll), value: roll };
    if (roll >= effectiveTarget + 10) return { result: "Critical failure", margin: Math.max(1, roll - effectiveTarget), value: roll };
    if (roll === 18) return { result: "Critical failure", margin: Math.max(1, roll - effectiveTarget), value: roll };
    if (effectiveTarget < 16 && roll === 17) return { result: "Critical failure", margin: Math.max(1, roll - effectiveTarget), value: roll };
    if (effectiveTarget >= 16 && roll === 17) return { result: "Failure", margin: Math.max(1, roll - effectiveTarget), value: roll };
    if (roll <= effectiveTarget) return { result: "Success", margin: Math.max(0, effectiveTarget - roll), value: roll };
    if (roll > effectiveTarget) return { result: "Failure", margin: Math.max(1, roll - effectiveTarget), value: roll };
}