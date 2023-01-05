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
}