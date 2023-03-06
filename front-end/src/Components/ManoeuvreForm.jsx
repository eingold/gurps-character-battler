import React from 'react'
import { useEffect } from 'react';
import { useState, useRef } from 'react';
import { submitManoeuvre } from '../utils/APICalls';
import Sheet from '../utils/sheet';

const ManoeuvreForm = ({ actor, updateActor, target, updateTarget, myTurn, changeTurn, defenceNeeded, setDefenceNeeded, logText, setLogText, attackingWeapon, setAttackingWeapon }) => {

    const [manoeuvre, setManoeuvre] = useState("Attack");
    const [weaponIndex, setWeaponIndex] = useState(0);
    const [parryWeaponIndex, setParryWeaponIndex] = useState(0);
    const [blockWeaponIndex, setBlockWeaponIndex] = useState(0);
    const [weapon, setWeapon] = useState({});
    const [parryWeapon, setParryWeapon] = useState({});
    const [blockWeapon, setBlockWeapon] = useState({});
    const [modifiers, setModifiers] = useState({});

    let weapons = useRef([]);
    let parryWeapons = useRef([]);
    let blockWeapons = useRef([]);
    let weaponOptions = useRef(<></>);
    let parryWeaponOptions = useRef(<></>);
    let blockWeaponOptions = useRef(<></>);

    useEffect(() => {
        setWeaponIndex(0);
        setParryWeaponIndex(0);
        setBlockWeaponIndex(0);
        if (Object.keys(actor).length > 0) {
            weapons.current = actor.getMeleeWeapons();
            parryWeapons.current = actor.getParryWeapons();
            blockWeapons.current = actor.getBlockWeapons();
            weaponOptions.current = weapons.current.map((e, i) => {
                return <option value={i} key={i}> {`${e.name}${e.usage ? ` (${e.usage})` : ""}`}</option >
            });
            parryWeaponOptions.current = parryWeapons.current.map((e, i) => {
                return <option value={i} key={i}> {`${e.name}${e.usage ? ` (${e.usage})` : ""}`}</option >
            });
            blockWeaponOptions.current = blockWeapons.current.map((e, i) => {
                return <option value={i} key={i}> {`${e.name}${e.usage ? ` (${e.usage})` : ""}`}</option >
            });
            setWeapon(weapons.current[0]);
            setParryWeapon(parryWeapons.current[0]);
            setBlockWeapon(blockWeapons.current[0]);
        }
    }, [actor])

    useEffect(() => {
        setWeapon(weapons.current[weaponIndex]);
    }, [weaponIndex])

    useEffect(() => {
        setParryWeapon(parryWeapons.current[parryWeaponIndex]);
    }, [parryWeaponIndex])

    useEffect(() => {
        setBlockWeapon(blockWeapons.current[blockWeaponIndex]);
    }, [blockWeaponIndex])

    useEffect(() => {
        if (defenceNeeded) setManoeuvre("Dodge");
        else setManoeuvre("Attack");
    }, [defenceNeeded])

    const selectDefendingWeapon = () => {
        switch (manoeuvre) {
            case "Block":
                return blockWeapon;
            case "Parry":
                return parryWeapon;
            default:
                return {};
        }
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const manoeuvrePackage = {
            manoeuvre,
            attackingWeapon: defenceNeeded ? attackingWeapon : weapon,
            defendingWeapon: selectDefendingWeapon(),
            actor: actor.sheet,
            target: target.sheet,
            modifiers
        };
        console.log(manoeuvrePackage);
        const res = await submitManoeuvre(manoeuvrePackage);
        console.log(res);
        setLogText(logText + res.logText)
        updateActor(new Sheet(res.actor));
        updateTarget(new Sheet(res.target));
        setDefenceNeeded(res.defenceNeeded);
        if (res.defenceNeeded) {
            setAttackingWeapon(res.attackingWeapon);
        } else {
            changeTurn();
        }
        setWeaponIndex(0);
        setParryWeaponIndex(0);
        setBlockWeaponIndex(0);
    }

    return (
        <>{
            Object.keys(actor).length > 0 && <div>
                <form>
                    {((myTurn && !defenceNeeded) || (!myTurn && defenceNeeded)) && <select value={manoeuvre} name="manoeuvre" id="manoeuvre" onChange={e => { setManoeuvre(e.target.value) }}>
                        {defenceNeeded ?
                            <>
                                <option value="Dodge">Dodge</option>
                                <option value="Parry">Parry</option>
                                <option value="Block">Block</option>
                            </>
                            :
                            <>
                                <option value="Attack">Attack</option>
                                <option value="Do Nothing">Do Nothing</option>
                            </>
                        }
                    </select>}
                    {myTurn && manoeuvre === "Attack" &&
                        (weapons.current.length > 0
                            ?
                            <select value={weaponIndex} name="weapon" id="weapon" onChange={e => { setWeaponIndex(e.target.value) }}>
                                {weaponOptions.current}
                            </select>
                            :
                            <select>
                                <option>No weapons available</option>
                            </select>
                        )
                    }
                    {defenceNeeded && manoeuvre === "Parry" &&
                        (parryWeapons.current.length > 0
                            ?
                            <select value={parryWeaponIndex} name="parryWeapon" id="parryWeapon" onChange={e => { setParryWeaponIndex(e.target.value) }}>
                                {parryWeaponOptions.current}
                            </select>
                            :
                            <select>
                                <option>No parrying weapons available</option>
                            </select>
                        )
                    }
                    {defenceNeeded && manoeuvre === "Block" &&
                        (blockWeapons.current.length > 0
                            ?
                            <select value={blockWeaponIndex} name="blockWeapon" id="blockWeapon" onChange={e => { setBlockWeaponIndex(e.target.value) }}>
                                {blockWeaponOptions.current}
                            </select>
                            :
                            <select>
                                <option>No blocking weapons available</option>
                            </select>
                        )
                    }
                    <p>{((myTurn && !defenceNeeded) || (!myTurn && defenceNeeded)) ? `You have selected ${manoeuvre}${manoeuvre === "Attack" && weapons.current.length > 0 ? ` with ${weapon?.name}${weapon?.usage ? ` (${weapon.usage})` : ""}` : (manoeuvre === "Parry" && parryWeapons.current.length > 0 ? ` with ${parryWeapon.name}` : (manoeuvre === "Block" && blockWeapons.current.length > 0 ? ` with ${blockWeapon.name}` : ""))}` : myTurn ? `${target.getCharacterName()} must choose a defence` : `${target.getCharacterName()}'s turn`}</p>
                    {((myTurn && !defenceNeeded) || (!myTurn && defenceNeeded)) && <button onClick={handleSubmit} disabled={!((myTurn && !defenceNeeded) || (!myTurn && defenceNeeded)) || (manoeuvre === "Attack" && weapons.current.length === 0) || (manoeuvre === "Parry" && parryWeapons.current.length === 0) || (manoeuvre === "Block" && blockWeapons.current.length === 0)}>Submit</button>}
                </form>
            </div>
        }</>
    )
}

export default ManoeuvreForm