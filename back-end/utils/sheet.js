//This file provides utilities for navigating a .gcs JSON profile for a GURPS character

export default class Sheet {

    sheet;

    constructor(sheet) {
        this.sheet = sheet;
    }

    getCharacterName() { return this.sheet?.profile?.name; }

    getAttributes() {
        const attributeList = this.sheet?.settings?.attributes;
        let attributes = [];
        for (let a of attributeList) {
            let name, value;
            if (a.full_name) {
                name = `${a.full_name} (${a?.name})`;
            } else {
                name = a?.name;
            }
            value = this.sheet?.attributes?.find(element => {
                return element.attr_id === a.id
            })?.calc?.value;
            attributes.push({ name, value });
        }
        return attributes;
    }

    applyInjury(damage) {
        this.sheet.attributes = this.sheet.attributes.map(e => {
            if (e.attr_id === "hp") {
                e.calc.current -= damage;
            }
            return e;
        })
    }

    applyFatigue(damage) {
        this.sheet.attributes = this.sheet.attributes.map(e => {
            if (e.attr_id === "fp") {
                e.calc.current -= damage;
            }
            return e;
        })
    }

    hasAttribute(attribute) {
        return this.sheet?.settings?.attributes.some(element => {
            return element?.id?.toLowerCase() === attribute.toLowerCase()
                || element?.name?.toLowerCase() === attribute.toLowerCase()
                || element?.full_name?.toLowerCase() === attribute.toLowerCase();
        })
    }

    getAttribute(attribute) {
        if (this.hasAttribute(attribute)) {
            const id = this.sheet?.settings?.attributes.find(element => {
                return element?.id?.toLowerCase() === attribute.toLowerCase()
                    || element?.name?.toLowerCase() === attribute.toLowerCase()
                    || element?.full_name?.toLowerCase() === attribute.toLowerCase();
            })?.id;
            return this.sheet?.attributes.find(element => element?.attr_id === id)?.calc?.value;
        } else {
            return undefined;
        }
    }

    hasSkill(skill, specialisation = undefined) {
        if (!specialisation) {
            return this.sheet?.skills.some(element => {
                return element?.name.toLowerCase() === skill.toLowerCase();
            });
        } else {
            return this.sheet?.skills.some(element => {
                return element?.name.toLowerCase() === skill.toLowerCase() && element?.specialization?.toLowerCase() === specialisation?.toLowerCase();
            });
        }
    }

    getSkill(skill, specialisation) {
        if (specialisation) {
            if (this.hasSkill(skill, specialisation)) {
                return this.sheet?.skills?.find(element => element?.name?.toLowerCase() === skill?.toLowerCase() && element?.specialization?.toLowerCase() === specialisation?.toLowerCase())?.calc?.level;
            } else {
                return undefined;
            }
        } else {
            if (this.hasSkill(skill)) {
                return this.sheet?.skills?.find(element => element?.name?.toLowerCase() === skill?.toLowerCase())?.calc?.level;
            } else {
                return undefined;
            }
        }
    }

    getSkills() {
        const skillList = this.sheet?.skills;
        let skills = [];
        for (let s of skillList) {
            let name, value;
            if (s.specialization) {
                name = `${s?.name} (${s.specialization})`
            } else {
                name = s?.name;
            }
            value = s?.calc?.level;
            skills.push({ name, value });
        }
        return skills;
    }

    getMeleeWeapons() {
        const possibleMeleeWeaponsList = this?.sheet?.traits?.concat(this?.sheet?.equipment);
        let meleeWeapons = [];
        for (let p of possibleMeleeWeaponsList) {
            let name, usage, reach, skillLevel, strength, parry, block, damage;
            if (!p.weapons) continue;
            for (let w of p.weapons) {
                if (w.type === "melee_weapon") {
                    name = p?.description ? p.description : p.name;
                    strength = w?.strength?.toString();
                    usage = w?.usage;
                    reach = w?.reach?.toString();
                    skillLevel = w?.calc?.level?.toString();
                    parry = w?.calc?.parry ? w?.calc?.parry?.toString() : "No";
                    block = w?.calc?.block ? w?.calc?.block?.toString() : "No";
                    damage = w?.calc?.damage;
                    meleeWeapons.push({ name, strength, usage, reach, skillLevel, parry, block, damage });
                }
            }
        }
        return meleeWeapons;
    }

    getDodge() {
        return this.sheet.calc.dodge[0];
    }

    getDamageResistance(location = "Torso", type = "crushing") {
        const bodyPlan = this.sheet.settings.body_type.locations;
        let bodyPart;
        if (!bodyPlan.some(e => e.table_name === location)) {
            return 0;
        } else {
            bodyPart = bodyPlan.find(e => e.table_name === location);
        }
        return bodyPart.calc.dr.all + (type in bodyPart.calc.dr ? bodyPart.calc.dr[type] : 0);
    }

    penetratingDamage(damage, type, location = "Torso") {
        return Math.max(damage - this.getDamageResistance(location, type), 0)
    }

    calculateInjury(damage, type, location = "Torso") {
        console.log(damage);
        console.log(type);
        switch (type) {
            case "crushing":
                return damage;
            case "cutting":
                return Math.floor(damage * 1.5);
            case "impaling":
                return damage * 2;
            case "small piercing":
                if (damage === 1) return 1;
                return Math.floor(damage * 0.5);
            case "piercing":
                return damage;
            case "large piercing":
                return Math.floor(damage * 1.5);
            case "huge piercing":
                return damage * 2;
            case "burn":
                return damage;
            case "corrosion":
                return damage;
            case "toxic":
                return damage;
            case "fatigue":
                return damage;
            case "injury":
                return damage;
        }
    }

    damage(damage, type, logText, location = "Torso") {
        const name = this.getCharacterName();
        logText += `${name} is hit for ${damage} points of ${type} damage\n`;
        const penetratingDamage = this.penetratingDamage(damage, type, location);
        if (this.getDamageResistance(location, type) > 0) {
            logText += `${name}'s ${location} DR of ${this.getDamageResistance(location, type)} against ${type} damage reduces it to ${penetratingDamage} penetrating damage\n`;
        } else {
            logText += `${name} has no ${location} DR against ${type} damage\n`;
        }
        if (penetratingDamage === 0) {
            logText += `No damage penetrates ${name}'s DR\n`;
            return logText;
        }
        let woundingModifier;
        switch (type) {
            case "crushing":
                woundingModifier = "×1";
                break;
            case "cutting":
                woundingModifier = "×1.5";
                break;
            case "impaling":
                woundingModifier = "×2";
                break;
            case "small piercing":
                woundingModifier = "×0.5";
                break;
            case "piercing":
                woundingModifier = "×1";
                break;
            case "large piercing":
                woundingModifier = "×1.5";
                break;
            case "huge piercing":
                woundingModifier = "×2";
                break;
            case "burn":
                woundingModifier = "×1";
                break;
            case "corrosion":
                woundingModifier = "×1";
                break;
            case "toxic":
                woundingModifier = "×1";
                break;
            case "fatigue":
                woundingModifier = "×1";
                break;
            case "injury":
                woundingModifier = "×1";
                break;
        }
        const injury = this.calculateInjury(penetratingDamage, type, location);
        if (type === "fatigue") {
            logText += `Wounding modifier of ${woundingModifier} for ${type} damage converts this to ${injury} points of fatigue\n`;
            logText += `${name} takes ${injury} points of fatigue`;
            this.applyFatigue(injury);
            return logText;
        }
        logText += `Wounding modifier of ${woundingModifier} for ${type} damage converts this to ${injury} points of injury\n`;
        logText += `${name} takes ${injury} points of injury`;
        this.applyInjury(injury);
        return logText;
    }
}