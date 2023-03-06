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
            let name, value, type;
            if (a.full_name) {
                name = `${a.full_name} (${a?.name})`;
            } else {
                name = a?.name;
            }
            if (a.type === "pool") {
                type = "pool";
            } else if (a.attribute_base.includes("$")) {
                type = "secondary";
            } else {
                type = "primary";
            }
            value = this.sheet?.attributes?.find(element => {
                return element.attr_id === a.id
            })?.calc?.current ? this.sheet?.attributes?.find(element => {
                return element.attr_id === a.id
            })?.calc?.current : this.sheet?.attributes?.find(element => {
                return element.attr_id === a.id
            })?.calc?.value;
            attributes.push({ name, value, type });
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
        const possibleMeleeWeaponsList = this?.sheet?.traits?.concat(this?.sheet?.equipment ? this.sheet.equipment : []);
        let meleeWeapons = [];
        let meleeWeaponsContainers = [];
        /*
        Idea is to sort the list into a list of containers and a list of non-containers, then repeatedly look through the list of containers, move any non-container children into the list of non-containers, and move any container children into the container list, then delete that container from the container list, until the container list is empty
        */
        possibleMeleeWeaponsList.forEach((e, i) => {
            if (e.type === "trait_container" || e.type === "equipment_container") {
                meleeWeaponsContainers.push(e);
                meleeWeapons.splice(i, 1);
            }
        });
        while (meleeWeaponsContainers.length !== 0) {
            meleeWeaponsContainers.forEach((e, i) => {
                e.children.forEach(e => {
                    if (e.type === "trait" || e.type === "equipment") {
                        possibleMeleeWeaponsList.push(e);
                    } else if (e.type === "trait_container" || e.type === "equipment_container") {
                        meleeWeaponsContainers.push(e);
                    }
                });
                meleeWeaponsContainers.splice(i, 1);
            });
        }
        for (let p of possibleMeleeWeaponsList) {
            let name, usage, reach, skillLevel, strength, parry, block, damage;
            if (!p?.weapons) continue;
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

    getParryWeapons() {
        return this.getMeleeWeapons().filter((e) => {
            return e.parry !== "No";
        })
    }

    getBlockWeapons() {
        return this.getMeleeWeapons().filter((e) => {
            return e.block !== "No";
        })
    }

    getCarryWeight() {
        let carryWeight = 0;
        let precision = 0;
        const equipment = this.sheet?.equipment;
        if (equipment === undefined) return carryWeight;
        for (let e of equipment) {
            carryWeight += Number.parseFloat(e.calc.extended_weight);
            const matches = e.calc.extended_weight.match(/\.\d+\D/);
            if (matches !== null) for (let m of matches) {
                precision = Math.max(precision, m.length - 2);
            }
        }
        return carryWeight.toFixed(precision);
    }

    getBasicLift() {
        return this?.sheet?.calc?.basic_lift ? Number.parseFloat(this.sheet.calc.basic_lift) : 0;
    }

    getEncumbrance() {
        const basic_lift = this.getBasicLift();
        const carryWeight = this.getCarryWeight();
        if (carryWeight <= basic_lift) return 0;
        if (carryWeight <= 2 * basic_lift) return 1;
        if (carryWeight <= 3 * basic_lift) return 2;
        if (carryWeight <= 6 * basic_lift) return 3;
        if (carryWeight <= 10 * basic_lift) return 4;
    }

    getEncumbranceName() {
        return ["None", "Light", "Medium", "Heavy", "Extra-Heavy"][this.getEncumbrance()];
    }
}