import axios from 'axios';

export const submitManoeuvre = async manoeuvre => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_URL}/manoeuvre`, manoeuvre);
        return { actor: res.data.actor, target: res.data.target, modifiers: res.data.modifiers, defenceNeeded: res.data.defenceNeeded, status: res.status, logText: res.data.logText, attackingWeapon: res.data.attackingWeapon };
    }
    catch (e) {
        return {
            status: e.response?.status,
            error: {
                type: `post`,
                data: e.response?.data.error
            }
        };
    }
}