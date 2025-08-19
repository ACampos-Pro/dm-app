import React, { useState } from 'react';

const STAT_DESCRIPTIONS = {
    grit: 'Grit (Health, physical toughness)',
    reflex: 'Reflex (Speed, combat, driving)',
    smarts: 'Smarts (Tech, hacking, tactics)',
    charm: 'Charm (Persuasion, disguise, lying)',
    cool: 'Cool (Nerves, stealth, composure)'
};

const ROLES = [
    "Street Merc",
    "Hacker (Netrunner)",
    "Fixer",
    "Techie",
    "Face",
    "Nomad",
    "MedTech"
];

const ROLE_TOOLTIPS = {
    "Street Merc": `Street Merc

💪 Advantage:
Always ready for a fight — +1 on any combat roll when using guns or melee weapons.
Can intimidate low-level gangers and petty criminals without a roll.
Knows black market arms dealers — can find weapons faster/cheaper than others.

⚠ Disadvantage:
Not subtle — Stealth attempts are always made at disadvantage.
Loud reputation — Enemies are more likely to target or challenge you.
Overly direct — struggles with complex tech or hacking challenges.`,
};

//const SKILLS = [
    //'Shooting', 'Sneaking', 'Driving', 'Talking', 'Fixing tech',
   // 'Hacking', 'Healing', 'Fighting', 'Scamming', 'Tracking'
//];

const WEAPONS = ["Pistol", "Blade", "SMG", "Shotgun", "Hacking Deck"];
const GEAR_OPTIONS = [
    "Medkit", "Lockpick Set", "EMP Grenade", "Holo Projector",
    "Armor Vest", "Data Chip", "Stim Pack", "Grapple Hook"
];
const CYBERNETICS = [
    "Optical Enhancer", "Reflex Boosters", "Arm Blade", "Neural Jack", "Subdermal Armor"
];

const BACKGROUND_OPTIONS = {
    birthplace: [
        "Mega-city slums",
        "Corporate enclave",
        "Nomad convoy",
        "Experimental lab"
    ],
    hunter: [
        "A bounty hunter with your name tattooed on their arm",
        "An ex-lover turned corporate assassin",
        "The gang you betrayed",
        "Yourself — or at least a clone of you"
    ],
    secret: [
        "You used to be a corp asset",
        "You leaked sensitive data",
        "You’re infected with experimental tech",
        "You caused a massacre, directly or indirectly"
    ],
    item: [
        "A chip with the location of a hidden vault",
        "A prototype cyberware nobody else has",
        "An old-school data cassette with forbidden knowledge",
        "A child (biological or synthetic) that everyone’s after"
    ]
};

const CharacterCreationView = ({ initialData, socket }) => {
    const [sheet, setSheet] = useState({
        info: { name: initialData.playerName || '', alias: '', age: '', look: '', gold: 0 },
        role: 'Street Merc',
        stats: { grit: 1, reflex: 1, smarts: 1, charm: 1, cool: 1 },
        skills: [],
        weapons: [],
        gear: [],
        cybernetic: '',
        background: {
            birthplace: BACKGROUND_OPTIONS.birthplace[0],
            hunter: BACKGROUND_OPTIONS.hunter[0],
            secret: BACKGROUND_OPTIONS.secret[0],
            item: BACKGROUND_OPTIONS.item[0]
        }
    });
    const [hoveredRole, setHoveredRole] = useState(null);

    // Info
    const handleInfoChange = e => setSheet(s => ({
        ...s,
        info: { ...s.info, [e.target.name]: e.target.value }
    }));

    // Stats
    const handleStatChange = e => {
        const { name, value } = e.target;
        const newStatValue = Math.max(0, Math.min(5, parseInt(value) || 0));
        const oldStatValue = sheet.stats[name];
        const pointDifference = newStatValue - oldStatValue;
        const currentTotalPoints = Object.values(sheet.stats).reduce((sum, val) => sum + val, 0);
        if (pointDifference > 0 && currentTotalPoints + pointDifference > 10) {
            return;
        }
        setSheet(s => ({ ...s, stats: { ...s.stats, [name]: newStatValue } }));
    };

    // Role
    const handleRoleChange = e => setSheet(s => ({ ...s, role: e.target.value }));

    // Weapons (max 2)
    const toggleWeapon = (weapon) => {
        setSheet(s => {
            const hasWeapon = s.weapons.includes(weapon);
            let newWeapons;
            if (hasWeapon) {
                newWeapons = s.weapons.filter(w => w !== weapon);
            } else {
                if (s.weapons.length >= 2) return s;
                newWeapons = [...s.weapons, weapon];
            }
            return { ...s, weapons: newWeapons };
        });
    };

    // Gear (max 2)
    const toggleGear = (gear) => {
        setSheet(s => {
            const hasGear = s.gear.includes(gear);
            let newGear;
            if (hasGear) {
                newGear = s.gear.filter(g => g !== gear);
            } else {
                if (s.gear.length >= 2) return s;
                newGear = [...s.gear, gear];
            }
            return { ...s, gear: newGear };
        });
    };

    // Cybernetic (pick one)
    const handleCyberChange = e => setSheet(s => ({ ...s, cybernetic: e.target.value }));

    // Skills (max 2)
   /* const toggleSkill = (skill) => {
        setSheet(s => {
            const hasSkill = s.skills.includes(skill);
            let newSkills;
            if (hasSkill) {
                newSkills = s.skills.filter(sk => sk !== skill);
            } else {
                if (s.skills.length >= 2) return s;
                newSkills = [...s.skills, skill];
            }
            return { ...s, skills: newSkills };
        });
    }; */

    // Background
    const handleBackgroundChange = (field) => (e) => {
        setSheet(s => ({
            ...s,
            background: { ...s.background, [field]: e.target.value }
        }));
    };

    // Validation
    const totalStatPoints = Object.values(sheet.stats).reduce((sum, val) => sum + val, 0);
    const remainingPoints = 10 - totalStatPoints;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (remainingPoints !== 0) {
            alert(`You must distribute exactly 10 points. You have ${remainingPoints} points left to assign.`);
            return;
        }
        if (sheet.skills.length !== 2) {
            alert('You must choose exactly 2 skills.');
            return;
        }
        if (sheet.weapons.length === 0) {
            alert("Please choose at least 1 weapon");
            return;
        }
        if (!sheet.cybernetic) {
            alert("Please choose a cybernetic");
            return;
        }
        if (sheet.gear.length === 0) {
            alert("Please choose at least 1 gear item");
            return;
        }
        socket.emit('character:create', sheet);
    };

    return (
        <div className="view">
            <h2>⚡ CYBERPUNK LITE CHARACTER SHEET ⚡</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>🧑 Character Info</legend>
                    <div className="form-grid">
                        <div><label>Name</label><input type="text" value={sheet.info.name} readOnly /></div>
                        <div><label>Alias/Nickname</label><input type="text" name="alias" value={sheet.info.alias} onChange={handleInfoChange} /></div>
                        <div><label>Age</label><input type="text" name="age" value={sheet.info.age} onChange={handleInfoChange} /></div>
                    </div>
                    <label>Look (describe clothes, cybernetics, style)</label>
                    <textarea name="look" value={sheet.info.look} onChange={handleInfoChange} rows="3"></textarea>
                </fieldset>
                <fieldset>
                    <legend>🛠️ ROLE / ARCHETYPE</legend>
                    <div className="radio-group form-grid">
                        {ROLES.map(r => (
                            <label
                                key={r}
                                style={{ position: "relative" }}
                                onMouseEnter={() => setHoveredRole(r)}
                                onMouseLeave={() => setHoveredRole(null)}
                            >
                                <input type="radio" name="role" value={r} checked={sheet.role === r} onChange={handleRoleChange} />{r}
                                {hoveredRole === r && ROLE_TOOLTIPS[r] && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: "110%",
                                            top: 0,
                                            background: "#181825",
                                            color: "#cdd6f4",
                                            border: "1px solid #45475a",
                                            borderRadius: 8,
                                            padding: "1rem",
                                            width: 320,
                                            zIndex: 10,
                                            whiteSpace: "pre-line",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        {ROLE_TOOLTIPS[r]}
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>📊 STATS (Distribute 10 points, max 5 per stat)</legend>
                    <p>Points Remaining: <strong style={{color: remainingPoints === 0 ? '#a6e3a1' : '#f38ba8'}}>{remainingPoints}</strong></p>
                    <div className="form-grid">
                        {Object.keys(sheet.stats).map(stat => (
                            <div key={stat}>
                                <label>{STAT_DESCRIPTIONS[stat]}</label>
                                <input type="number" name={stat} value={sheet.stats[stat]} onChange={handleStatChange} min="0" max="5" />
                            </div>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🧰 WEAPONS (Pick up to 2)</legend>
                    <div className="checkbox-group form-grid">
                        {WEAPONS.map(w => (
                            <label key={w}>
                                <input
                                    type="checkbox"
                                    checked={sheet.weapons.includes(w)}
                                    onChange={() => toggleWeapon(w)}
                                    disabled={!sheet.weapons.includes(w) && sheet.weapons.length >= 2}
                                />{w}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🎒 GEAR (Pick up to 2)</legend>
                    <div className="checkbox-group form-grid">
                        {GEAR_OPTIONS.map(g => (
                            <label key={g}>
                                <input
                                    type="checkbox"
                                    checked={sheet.gear.includes(g)}
                                    onChange={() => toggleGear(g)}
                                    disabled={!sheet.gear.includes(g) && sheet.gear.length >= 2}
                                />{g}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🦾 CYBERNETICS (Pick one)</legend>
                    <div className="radio-group form-grid">
                        {CYBERNETICS.map(c => (
                            <label key={c}>
                                <input
                                    type="radio"
                                    name="cybernetic"
                                    value={c}
                                    checked={sheet.cybernetic === c}
                                    onChange={handleCyberChange}
                                />{c}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>🧬 BACKGROUND BUILDER</legend>
                    <label>Where were you born?</label>
                    <div className="radio-group">
                        {BACKGROUND_OPTIONS.birthplace.map(opt => (
                            <label key={opt}>
                                <input
                                    type="radio"
                                    name="birthplace"
                                    value={opt}
                                    checked={sheet.background.birthplace === opt}
                                    onChange={handleBackgroundChange("birthplace")}
                                />{opt}
                            </label>
                        ))}
                    </div>
                    <label>Someone is hunting you. Who is it?</label>
                    <div className="radio-group">
                        {BACKGROUND_OPTIONS.hunter.map(opt => (
                            <label key={opt}>
                                <input
                                    type="radio"
                                    name="hunter"
                                    value={opt}
                                    checked={sheet.background.hunter === opt}
                                    onChange={handleBackgroundChange("hunter")}
                                />{opt}
                            </label>
                        ))}
                    </div>
                    <label>What’s the one thing you can’t let anyone find out?</label>
                    <div className="radio-group">
                        {BACKGROUND_OPTIONS.secret.map(opt => (
                            <label key={opt}>
                                <input
                                    type="radio"
                                    name="secret"
                                    value={opt}
                                    checked={sheet.background.secret === opt}
                                    onChange={handleBackgroundChange("secret")}
                                />{opt}
                            </label>
                        ))}
                    </div>
                    <label>What valuable item are you hiding?</label>
                    <div className="radio-group">
                        {BACKGROUND_OPTIONS.item.map(opt => (
                            <label key={opt}>
                                <input
                                    type="radio"
                                    name="item"
                                    value={opt}
                                    checked={sheet.background.item === opt}
                                    onChange={handleBackgroundChange("item")}
                                />{opt}
                            </label>
                        ))}
                    </div>
                </fieldset>
                <button type="submit"
                    disabled={
                        remainingPoints !== 0 ||
                        sheet.skills.length !== 2 ||
                        sheet.weapons.length === 0 ||
                        !sheet.cybernetic ||
                        sheet.gear.length === 0
                    }
                >
                    Confirm Character
                </button>
            </form>
        </div>
    );
};

export default CharacterCreationView;
