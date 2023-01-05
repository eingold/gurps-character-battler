import Sheet from "../../utils/sheet";
import testSheet from "../mockData/testCharacter";

const testCharacter = new Sheet(testSheet);

describe('Tests for sheet object methods', () => {

    test('should get the character name when getCharacterName is called', () => {
        expect(testCharacter.getCharacterName()).toBe("Test Character");
    });

    test('should return an array of attributes and values when getAttributes is called', () => {
        expect(testCharacter.getAttributes()).toBeInstanceOf(Array);
        expect(testCharacter.getAttributes()).toContainEqual({ name: "Strength (ST)", value: 10 });
        expect(testCharacter.getAttributes()).toContainEqual({ name: "Basic Move", value: 5 });
    })

    test('should return true when hasSkill queries about a skill the character has', () => {
        expect(testCharacter.hasSkill("Shortsword")).toBe(true);
    })

    test('should return false when hasSkill queries about a skill the character does not have', () => {
        expect(testCharacter.hasSkill("Dancing")).toBe(false);
    })

    test('should return the value of the skill when getSkill is queried', () => {
        expect(testCharacter.getSkill("Shortsword")).toBe(9);
    })

    test('should return undefined when getSkill is queried on a skill the user lacks', () => {
        expect(testCharacter.getSkill("Dancing")).toBe(undefined);
    })

    test('should return true when hasAttribute queries about an attribute the character has', () => {
        //Works using the name, abbreviation, or GCS shorthand
        expect(testCharacter.hasAttribute("Dexterity")).toBe(true);
        expect(testCharacter.hasAttribute("ST")).toBe(true);
        expect(testCharacter.hasAttribute("basic_move")).toBe(true);
    })

    test('should return false when hasAttribute queries about an attribute the character lacks', () => {
        expect(testCharacter.hasAttribute("Quintessence")).toBe(false);
    })

    test('should return the value of the attribute when getAttribute is queried', () => {
        //Works using the name, abbreviation, or GCS shorthand
        expect(testCharacter.getAttribute("Will")).toBe(10);
        expect(testCharacter.getAttribute("HT")).toBe(10);
        expect(testCharacter.getAttribute("basic_speed")).toBe(5);
    })

    test('should return undefined when getAttribute is queried on an attribute the character lacks', () => {
        expect(testCharacter.getAttribute("QN")).toBe(undefined);
    })

    test('should return true when hasSkill queries a specialisation for a skill that the character has', () => {
        expect(testCharacter.hasSkill("Shield", "Buckler")).toBe(true);
    })

    test('should return false when hasSkill queries a specialisation for a skill that the character lacks', () => {
        expect(testCharacter.hasSkill("Shield", "Force")).toBe(false);
    })

    test('should return the value of a specialised skill when getSkill is provided with a specialisation', () => {
        expect(testCharacter.getSkill("Shield", "Buckler")).toBe(10);
    })

    test('should return undefined when getSkill is provided with a specialisation the character lacks', () => {
        expect(testCharacter.getSkill("Shield", "Force")).toBe(undefined);
    })

    test('should return an array of skills and values when getSkills is called', () => {
        expect(testCharacter.getSkills()).toBeInstanceOf(Array);
        expect(testCharacter.getSkills()).toContainEqual({ name: "Shortsword", value: 9 });
        expect(testCharacter.getSkills()).toContainEqual({ name: "Shield (Buckler)", value: 10 });
    })

    test('should return an array of weapons and stats when getMeleeWeapons is called', () => {
        expect(testCharacter.getMeleeWeapons()).toBeInstanceOf(Array);
        expect(testCharacter.getMeleeWeapons()).toContainEqual({ name: "Shortsword", usage: "Swung", skillLevel: "9", parry: "8", block: "No", damage: "1d cut", reach: "1", strength: "8" });
        expect(testCharacter.getMeleeWeapons()).toContainEqual({ name: "Shortsword", usage: "Thrust", skillLevel: "9", parry: "8", block: "No", damage: "1d-2 imp", reach: "1", strength: "8" });
        expect(testCharacter.getMeleeWeapons()).toContainEqual({ name: "Light Buckler", usage: undefined, skillLevel: "10", parry: "No", block: "9", damage: "1d-2 cr", reach: "1", strength: "0" });
    })
})