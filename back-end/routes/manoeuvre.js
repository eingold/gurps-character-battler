import express from "express";
import { damageParse } from "../utils/damageParse.js";
import { successRoll } from "../utils/diceRolls.js";
import Sheet from "../utils/sheet.js";

const router = express.Router();

router.route("/").post((req, res) => {
    let { manoeuvre, actor, target, attackingWeapon, defendingWeapon, modifiers } = req.body;
    actor = new Sheet(actor);
    target = new Sheet(target);
    let actorName = actor.getCharacterName();
    let targetName = target.getCharacterName();
    let defenceNeeded = false;
    let logText = "";
    let hitDamage = 0;
    switch (manoeuvre) {
        case "Attack":
            logText += `${actorName} attacks ${targetName} with ${attackingWeapon.name} (${attackingWeapon.usage})\n`;
            let hitResult = successRoll(attackingWeapon.skillLevel);
            logText += `${actorName} rolls ${hitResult.value} against a target of ${attackingWeapon.skillLevel}\n`;
            console.dir(hitResult);
            switch (hitResult.result) {
                case "Critical success":
                    logText += `${actorName} critically hits!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    target.damage(hitDamage);
                    logText += `${targetName} takes ${hitDamage} points of damage\n`;
                    break;
                case "Success":
                    logText += `${actorName} hits! ${targetName} must defend\n`;
                    defenceNeeded = true;
                    break;
                case "Failure":
                    logText += `${actorName} misses!\n`;
                    break;
                case "Critical failure":
                    logText += `${actorName} critically misses!\n`;
                    break;
                default:
                    break;
            }
            break;
        case "Parry":
            logText += `${actorName} tries to parry with ${defendingWeapon.name}\n`;
            console.dir(attackingWeapon);
            console.log(defendingWeapon.parry);
            let parryResult = successRoll(defendingWeapon.parry);
            logText += `${actorName} rolls ${parryResult.value} against a target of ${defendingWeapon.parry}\n`;
            console.dir(parryResult);
            switch (parryResult.result) {
                case "Critical success":
                    logText += `${actorName} critically succeeds!\n`;
                    break;
                case "Success":
                    logText += `${actorName} successfully parries!\n`;
                    break;
                case "Failure":
                    logText += `${actorName} fails to parry!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                case "Critical failure":
                    logText += `${actorName} critically fails!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                default:
                    break;
            }
            break;
        case "Block":
            logText += `${actorName} tries to block with ${defendingWeapon.name}\n`;
            console.dir(attackingWeapon);
            console.log(defendingWeapon.block);
            let blockResult = successRoll(defendingWeapon.block);
            logText += `${actorName} rolls ${blockResult.value} against a target of ${defendingWeapon.block}\n`;
            console.dir(blockResult);
            switch (blockResult.result) {
                case "Critical success":
                    logText += `${actorName} critically succeeds!\n`;
                    break;
                case "Success":
                    logText += `${actorName} successfully blocks!\n`;
                    break;
                case "Failure":
                    logText += `${actorName} fails to block!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                case "Critical failure":
                    logText += `${actorName} critically fails!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                default:
                    break;
            }
            break;
        case "Dodge":
            logText += `${actorName} tries to dodge\n`;
            console.dir(attackingWeapon);
            let dodge = actor.getDodge();
            let dodgeResult = successRoll(dodge);
            logText += `${actorName} rolls ${dodgeResult.value} against a target of ${dodge}\n`;
            console.dir(dodgeResult);
            switch (dodgeResult.result) {
                case "Critical success":
                    logText += `${actorName} critically succeeds!\n`;
                    break;
                case "Success":
                    logText += `${actorName} successfully dodges!\n`;
                    break;
                case "Failure":
                    logText += `${actorName} fails to dodge!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                case "Critical failure":
                    logText += `${actorName} critically fails!\n`;
                    hitDamage = damageParse(attackingWeapon.damage);
                    logText += `${actorName} takes ${hitDamage} points of damage\n`;
                    actor.damage(hitDamage);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    let response = { actor: actor.sheet, target: target.sheet, modifiers, defenceNeeded, logText, attackingWeapon };
    res.status(200).json(response);
})

export { router };