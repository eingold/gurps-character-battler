import React from 'react'

const CharacterPanel = ({ character }) => {
    const attributeList = () => {
        return character.getAttributes()?.map((e, i) =>
            <li key={i}>{`${e.name}${e.current ? `: ${e.current}` : `${e.value ? `: ${e.value}` : ""}`}`}</li>
        )
    }

    const meleeWeaponsList = () => {
        return character.getMeleeWeapons()?.map((e, i) =>
            <tr key={i}>
                <td>{e.name}</td>
                <td>{e.usage}</td>
                <td>{e.skillLevel}</td>
                <td>{e.parry}</td>
                <td>{e.block}</td>
                <td>{e.damage}</td>
                <td>{e.reach}</td>
                <td>{e.strength}</td>
            </tr>
        )
    }

    return (
        <div>
            {
                Object.keys(character).length > 0 && <>
                    <p>{character?.getCharacterName()}</p>
                    <ul className="list-unstyled">{attributeList()}</ul>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Melee Weapon</th>
                                <th>Usage</th>
                                <th>Skill Level</th>
                                <th>Parry</th>
                                <th>Block</th>
                                <th>Damage</th>
                                <th>Reach</th>
                                <th>ST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meleeWeaponsList()}
                        </tbody>
                    </table>
                    <p>Carry Weight: {character.getCarryWeight()}</p>
                    <p>Basic Lift: {character.getBasicLift()}</p>
                    <p>Encumbrance Level: {character.getEncumbranceName()} ({character.getEncumbrance()})</p>
                </>
            }
        </div >
    )
}

export default CharacterPanel